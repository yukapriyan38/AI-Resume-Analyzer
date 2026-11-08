const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    const error = new Error("Email service is not configured");
    error.statusCode = 503;
    throw error;
  }

  try {
    await axios.post(
      "https://api.resend.com/emails",
      { from: process.env.MAIL_FROM, to: [to], subject, html },
      { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const serviceMessage = error.response?.data?.message || "Email provider request failed";
    const emailError = new Error(serviceMessage);
    emailError.statusCode = 502;
    throw emailError;
  }
};

module.exports = { sendEmail };
