const path = require("path");
require("dotenv").config();
const validateEnv = require("./config/env");
validateEnv();

const fs = require("fs");
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const atsRoutes = require("./routes/atsRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.get("/api/liveness", (req, res) => res.status(200).json({ status: "alive" }));
app.get("/api/health/live", (req, res) => res.status(200).json({ status: "alive" }));
app.get("/api/health", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? "healthy" : "unhealthy",
    database: ready ? "connected" : "unavailable",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/jobs", jobRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);
let server;
const start = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close(false);
  process.exit(0);
};
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

start().catch((error) => {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
});

module.exports = app;
