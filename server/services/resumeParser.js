const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extracts raw text from a resume file on disk.
 * Supports PDF (pdf-parse) and DOCX (mammoth).
 */
const extractTextFromFile = async (filePath, fileType) => {
  const buffer = fs.readFileSync(filePath);

  if (fileType === "pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type for parsing");
};

// Basic regex-based helpers used as a fallback / cross-check
// alongside the AI-driven structured extraction in aiService.js
const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/);
  return match ? match[0].trim() : "";
};

const COMMON_SKILLS = [
  "javascript", "typescript", "react", "node.js", "nodejs", "express",
  "mongodb", "mongoose", "sql", "postgresql", "mysql", "python", "java",
  "c++", "c#", "html", "css", "tailwind", "redux", "next.js", "graphql",
  "rest api", "docker", "kubernetes", "aws", "azure", "gcp", "git",
  "ci/cd", "jenkins", "django", "flask", "spring boot", "vue", "angular",
  "figma", "agile", "scrum", "jira", "machine learning", "data analysis",
];

const extractSkillsFallback = (text) => {
  const lower = text.toLowerCase();
  return COMMON_SKILLS.filter((skill) => lower.includes(skill));
};

module.exports = {
  extractTextFromFile,
  extractEmail,
  extractPhone,
  extractSkillsFallback,
};
