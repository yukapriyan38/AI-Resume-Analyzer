const OpenAI = require("openai");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      timeout: Number(process.env.EXTERNAL_API_TIMEOUT_MS || 30000),
    })
  : null;

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Strips markdown code fences from a model response and parses JSON safely.
 */
const safeJsonParse = (raw) => {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON: " + err.message);
  }
};

const requireOpenAI = () => {
  if (!openai) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Set it in server/.env to enable AI features.",
    );
  }
};

/**
 * PROMPT 1: Full resume analysis.
 * Extracts structured resume data + ATS scoring + suggestions in one call.
 */
const analyzeResume = async (resumeText) => {
  requireOpenAI();

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume analyst.
Analyze the resume text and respond ONLY with a valid JSON object (no markdown, no preamble) using exactly this shape:

{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [""],
  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
  "education": [{"degree": "", "institution": "", "year": ""}],
  "certifications": [""],
  "projects": [{"title": "", "description": "", "technologies": [""]}],
  "atsScore": 0,
  "keywordScore": 0,
  "formatScore": 0,
  "grammarScore": 0,
  "readabilityScore": 0,
  "actionVerbScore": 0,
  "missingKeywords": [""],
  "strengths": [""],
  "weaknesses": [""],
  "suggestions": [""],
  "improvedSummary": "",
  "improvedBulletPoints": [""]
}

All scores are 0-100 integers. Base atsScore on formatting, keyword match, experience relevance, skills, education, grammar, achievements, action verbs, and quantified results.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze this resume:\n\n${resumeText}` },
    ],
    temperature: 0.3,
  });

  return safeJsonParse(response.choices[0].message.content);
};

/**
 * PROMPT 2: Compare resume against a specific job description.
 */
const matchResumeToJob = async (resumeText, jobDescription) => {
  requireOpenAI();

  const systemPrompt = `You are an expert recruiter and ATS system.
Compare the resume with the job description and respond ONLY with valid JSON in exactly this shape:

{
  "matchScore": 0,
  "matchedSkills": [""],
  "missingSkills": [""],
  "resumeImprovements": [""],
  "matchReason": ""
}

matchScore is an integer 0-100 representing how well the resume fits the job description.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
      },
    ],
    temperature: 0.3,
  });

  return safeJsonParse(response.choices[0].message.content);
};

/**
 * PROMPT 3: Suggest job titles suited to the resume, used to build search queries.
 */
const suggestJobTitles = async (resumeText) => {
  requireOpenAI();

  const systemPrompt = `You are a career advisor. Based on the resume, respond ONLY with valid JSON in exactly this shape:

{
  "jobTitles": ["", "", "", "", "", "", "", "", "", ""]
}

Return up to 10 job titles best suited for this candidate, ordered by relevance.`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Resume:\n\n${resumeText}` },
    ],
    temperature: 0.4,
  });

  const parsed = safeJsonParse(response.choices[0].message.content);
  return parsed.jobTitles || [];
};

module.exports = {
  analyzeResume,
  matchResumeToJob,
  suggestJobTitles,
};
