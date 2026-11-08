const required = ["JWT_SECRET", "CLIENT_URL"];

const validateEnv = () => {
  if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
    process.env.MONGO_URI = process.env.MONGODB_URI;
  }
  required.push("MONGO_URI");
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
};

module.exports = validateEnv;
