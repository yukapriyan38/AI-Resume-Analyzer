const mongoose = require("mongoose");

const jobSnapshotSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    company: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    experience: { type: String, default: "" },
    employmentType: { type: String, default: "" },
    description: { type: String, default: "" },
    applyUrl: { type: String, required: true },
    source: { type: String, enum: ["adzuna", "jsearch", "other"], default: "other" },
    externalId: { type: String, default: "" },
  },
  { _id: false }
);

const savedJobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobSnapshot: { type: jobSnapshotSchema, required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema);
