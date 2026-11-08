const express = require("express");
const {
  uploadResume,
  getResumeById,
  getResumeHistory,
  deleteResume,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const validateUploadedFile = require("../middleware/fileValidation");

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), validateUploadedFile, uploadResume);
router.get("/history", protect, getResumeHistory);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

module.exports = router;
