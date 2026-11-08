const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");
const SavedJob = require("../models/SavedJob");
const JobMatch = require("../models/JobMatch");
const Resume = require("../models/Resume");
const { searchJobs } = require("../services/jobService");
const { suggestJobTitles, matchResumeToJob } = require("../services/aiService");

const matchDetails = (match) =>
  match
    ? {
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        matchReason: match.matchReason,
      }
    : {};

// @desc    Search jobs based on the user's latest resume (or explicit query)
// @route   GET /api/jobs/search
// @access  Private
// Query params: q (optional manual search term), location (optional)
const searchJobsHandler = asyncHandler(async (req, res) => {
  const { q, location } = req.query;

  let queries = [];

  if (q) {
    queries = [q];
  } else {
    const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!latestResume) {
      res.status(400);
      throw new Error("Upload a resume first, or provide a search query (?q=)");
    }
    queries = await suggestJobTitles(latestResume.parsedText);
    if (!queries.length) queries = latestResume.skills.slice(0, 5);
  }

  const results = await searchJobs(queries, location || req.user.preferredLocation || "");

  // Upsert into our Jobs collection so they can be saved/referenced by _id
  const savedDocs = await Promise.all(
    results.map((job) =>
      Job.findOneAndUpdate(
        { externalId: job.externalId, source: job.source },
        { $set: job },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  const matches = await JobMatch.find({
    userId: req.user._id,
    jobId: { $in: savedDocs.map((job) => job._id) },
  }).lean();
  const matchesByJobId = new Map(matches.map((match) => [String(match.jobId), match]));
  const data = savedDocs.map((job) => ({
    ...job.toObject(),
    ...matchDetails(matchesByJobId.get(String(job._id))),
  }));

  res.status(200).json({ success: true, count: data.length, data });
});

// @desc    Compute an AI match score between the user's latest resume and a job
// @route   GET /api/jobs/match/:jobId
// @access  Private
const matchJobHandler = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  if (!latestResume) {
    res.status(400);
    throw new Error("Upload a resume first to get a match score");
  }

  const match = await matchResumeToJob(latestResume.parsedText, job.description || job.jobTitle);

  const jobMatch = await JobMatch.findOneAndUpdate(
    { userId: req.user._id, jobId: job._id },
    {
      matchScore: match.matchScore || 0,
      matchedSkills: match.matchedSkills || [],
      missingSkills: match.missingSkills || [],
      matchReason: match.matchReason || "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({
    success: true,
    data: { ...job.toObject(), ...matchDetails(jobMatch) },
  });
});

// @desc    Save a job for later
// @route   POST /api/jobs/save
// @access  Private
const saveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const existing = await SavedJob.findOne({ userId: req.user._id, jobId });
  if (existing) {
    res.status(400);
    throw new Error("Job already saved");
  }

  const savedJob = await SavedJob.create({
    userId: req.user._id,
    jobId,
    jobSnapshot: job.toObject(),
  });

  res.status(201).json({ success: true, data: savedJob });
});

// @desc    Remove a saved job
// @route   DELETE /api/jobs/save/:id
// @access  Private
// :id is the SavedJob document's _id
const removeSavedJob = asyncHandler(async (req, res) => {
  const savedJob = await SavedJob.findOne({ _id: req.params.id, userId: req.user._id });

  if (!savedJob) {
    res.status(404);
    throw new Error("Saved job not found");
  }

  await savedJob.deleteOne();

  res.status(200).json({ success: true, message: "Job removed from saved list" });
});

// @desc    Get all saved jobs for the logged-in user
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJob.find({ userId: req.user._id })
    .populate("jobId")
    .sort({ createdAt: -1 });
  const matches = await JobMatch.find({
    userId: req.user._id,
    jobId: { $in: savedJobs.map((savedJob) => savedJob.jobId?._id).filter(Boolean) },
  }).lean();
  const matchesByJobId = new Map(matches.map((match) => [String(match.jobId), match]));
  const data = savedJobs.map((savedJob) => {
    const currentJob = savedJob.jobId?.toObject?.() || savedJob.jobSnapshot;
    const match = matchesByJobId.get(String(savedJob.jobId?._id || savedJob.jobId));
    return {
      ...savedJob.toObject(),
      jobId: { ...currentJob, ...matchDetails(match) },
    };
  });

  res.status(200).json({ success: true, data });
});

module.exports = {
  searchJobsHandler,
  matchJobHandler,
  saveJob,
  removeSavedJob,
  getSavedJobs,
};
