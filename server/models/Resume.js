const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resumeUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileType: { type: String, enum: ["pdf", "docx"], required: true },
    parsedText: { type: String, default: "" },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    skills: [{ type: String }],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    certifications: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
      },
    ],
    summary: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
