const mongoose = require("mongoose");

const atsResultSchema = new mongoose.Schema(
  {
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    keywordScore: { type: Number, default: 0 },
    formatScore: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    readabilityScore: { type: Number, default: 0 },
    actionVerbScore: { type: Number, default: 0 },
    missingKeywords: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    improvedSummary: { type: String, default: "" },
    improvedBulletPoints: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ATSResult", atsResultSchema);
