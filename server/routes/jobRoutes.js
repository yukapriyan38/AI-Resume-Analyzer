const express = require("express");
const {
  searchJobsHandler,
  matchJobHandler,
  saveJob,
  removeSavedJob,
  getSavedJobs,
} = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/search", protect, searchJobsHandler);
router.get("/match/:jobId", protect, matchJobHandler);
router.post("/save", protect, saveJob);
router.delete("/save/:id", protect, removeSavedJob);
router.get("/saved", protect, getSavedJobs);

module.exports = router;
