const express = require("express");
const { getATSReport } = require("../controllers/atsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/:resumeId", protect, getATSReport);

module.exports = router;
