const asyncHandler = require("express-async-handler");
const ATSResult = require("../models/ATSResult");
const Resume = require("../models/Resume");

// @desc    Get the latest ATS report for a given resume
// @route   GET /api/ats/:resumeId
// @access  Private
const getATSReport = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  const atsResult = await ATSResult.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });

  if (!atsResult) {
    res.status(404);
    throw new Error("ATS report not found for this resume");
  }

  res.status(200).json({ success: true, data: atsResult });
});

module.exports = { getATSReport };
