const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkEmailAvailability,
  requestPasswordReset,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();
const emailValidation = body("email").isEmail().withMessage("A valid email is required");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    emailValidation,
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);
router.post("/login", [emailValidation, body("password").notEmpty().withMessage("Password is required")], loginUser);
router.get("/email-availability", checkEmailAvailability);
router.post(
  "/forgot-password",
  [emailValidation, body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
  requestPasswordReset
);
router.post("/logout", protect, logoutUser);

module.exports = router;
