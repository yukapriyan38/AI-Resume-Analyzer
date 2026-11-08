const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const validate = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400);
  throw new Error(errors.array()[0].msg);
};

const registerUser = asyncHandler(async (req, res) => {
  validate(req, res);
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  if (await User.exists({ email: normalizedEmail })) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: { _id: user._id, name: user.name, email: user.email },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  validate(req, res);
  const user = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select("+password");
  if (!user || !(await user.matchPassword(req.body.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email },
  });
});

const checkEmailAvailability = asyncHandler(async (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });
  res.status(200).json({ success: true, available: !(await User.exists({ email })) });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  validate(req, res);
  const email = req.body.email.toLowerCase().trim();
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(400);
    throw new Error("No account was found with this email");
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({ success: true, message: "Password reset successfully" });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = { registerUser, loginUser, logoutUser, checkEmailAvailability, requestPasswordReset };
