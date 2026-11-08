const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const Resume = require("../models/Resume");
const ATSResult = require("../models/ATSResult");
const { extractTextFromFile, extractEmail, extractPhone } = require("../services/resumeParser");
const { analyzeResume } = require("../services/aiService");

// @desc    Upload a resume, parse it, run AI analysis, and store results
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No resume file uploaded");
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const fileType = ext === ".pdf" ? "pdf" : "docx";
  let cloudinaryPublicId;

  try {
    // 1. Extract raw text locally
    const parsedText = await extractTextFromFile(filePath, fileType);

    // 2. Upload original file to Cloudinary for permanent storage
    const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "resumes",
      public_id: `${req.user._id}-${Date.now()}`,
    });
    cloudinaryPublicId = cloudinaryResult.public_id;

    // 3. Run AI structured analysis (extraction + ATS scoring) in one call
    const analysis = await analyzeResume(parsedText);

    // 4. Persist the resume record
    const resume = await Resume.create({
      userId: req.user._id,
      resumeUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      fileName: req.file.originalname,
      fileType,
      parsedText,
      name: analysis.name || "",
      email: analysis.email || extractEmail(parsedText),
      phone: analysis.phone || extractPhone(parsedText),
      skills: analysis.skills || [],
      experience: analysis.experience || [],
      education: analysis.education || [],
      certifications: analysis.certifications || [],
      projects: analysis.projects || [],
      summary: analysis.summary || "",
    });

    // 5. Persist the ATS result record, linked to the resume
    const atsResult = await ATSResult.create({
      resumeId: resume._id,
      userId: req.user._id,
      atsScore: analysis.atsScore || 0,
      keywordScore: analysis.keywordScore || 0,
      formatScore: analysis.formatScore || 0,
      grammarScore: analysis.grammarScore || 0,
      readabilityScore: analysis.readabilityScore || 0,
      actionVerbScore: analysis.actionVerbScore || 0,
      missingKeywords: analysis.missingKeywords || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      suggestions: analysis.suggestions || [],
      improvedSummary: analysis.improvedSummary || "",
      improvedBulletPoints: analysis.improvedBulletPoints || [],
    });

    res.status(201).json({ success: true, data: { resume, atsResult } });
  } catch (error) {
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" }).catch(() => {});
    }
    throw error;
  } finally {
    // Always clean up the temp file from disk
    fs.unlink(filePath, () => {});
  }
});

// @desc    Get a single resume by ID (must belong to the logged-in user)
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  const atsResult = await ATSResult.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { resume, atsResult } });
});

// @desc    Get all resumes uploaded by the logged-in user
// @route   GET /api/resume/history
// @access  Private
const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: resumes });
});

// @desc    Delete a resume (and its ATS results) by ID
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  await ATSResult.deleteMany({ resumeId: resume._id });
  if (resume.cloudinaryPublicId) {
    await cloudinary.uploader
      .destroy(resume.cloudinaryPublicId, { resource_type: "raw" })
      .catch((error) => console.error("Cloudinary deletion failed:", error.message));
  }
  await resume.deleteOne();

  res.status(200).json({ success: true, message: "Resume deleted successfully" });
});

module.exports = { uploadResume, getResumeById, getResumeHistory, deleteResume };
