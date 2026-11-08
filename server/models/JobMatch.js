const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    matchScore: { type: Number, min: 0, max: 100, required: true },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    matchReason: { type: String, default: "" },
  },
  { timestamps: true }
);

jobMatchSchema.index({ userId: 1, jobId: 1 }, { unique: true });
jobMatchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("JobMatch", jobMatchSchema);
