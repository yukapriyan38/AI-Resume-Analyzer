const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Resume = require("../models/Resume");
const ATSResult = require("../models/ATSResult");
const SavedJob = require("../models/SavedJob");

// @desc    Get logged-in user's profile + dashboard summary data
// @route   GET /api/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  let latestATSResult = null;
  if (latestResume) {
    latestATSResult = await ATSResult.findOne({ resumeId: latestResume._id }).sort({
      createdAt: -1,
    });
  }
  const savedJobsCount = await SavedJob.countDocuments({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      user,
      latestResume,
      latestATSResult,
      savedJobsCount,
    },
  });
});

// @desc    Update logged-in user's profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, location, experience, preferredRole, preferredLocation, skills } = req.body;

  user.name = name ?? user.name;
  user.location = location ?? user.location;
  user.experience = experience ?? user.experience;
  user.preferredRole = preferredRole ?? user.preferredRole;
  user.preferredLocation = preferredLocation ?? user.preferredLocation;
  if (Array.isArray(skills)) user.skills = skills;

  const updatedUser = await user.save();

  res.status(200).json({ success: true, data: updatedUser });
});

module.exports = { getProfile, updateProfile };
