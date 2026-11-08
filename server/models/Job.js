const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
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
    externalId: { type: String, index: true },
  },
  { timestamps: true }
);

jobSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model("Job", jobSchema);
