const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email (fire-and-forget safe).
 * Email failure should NEVER crash the main request flow.
 */
const sendMail = async (to, subject, html) => {
  try {
    if (!process.env.SMTP_HOST) {
      console.log("[Mailer] SMTP not configured — skipping email to", to);
      return;
    }
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`[Mailer] Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("[Mailer] Failed to send email:", error.message);
  }
};

module.exports = { sendMail };
