const nodemailer = require("nodemailer");

function getFromEmail() {
  return process.env.MAIL_FROM || process.env.ALERT_EMAIL;
}

/**
 * IMPORTANT (Render + Gmail):
 * Your live error `Connection timeout` confirms the host cannot reach Gmail SMTP.
 * Many PaaS providers block outbound SMTP. For production, prefer an HTTP email API
 * (Resend, SendGrid, Mailgun, etc.). This file supports both:
 *
 * - MAIL_PROVIDER=resend  -> uses HTTPS (recommended for Render)
 * - MAIL_PROVIDER=smtp    -> uses Nodemailer SMTP (works locally)
 *
 * Defaults:
 * - production: resend
 * - other envs: smtp
 */
const MAIL_PROVIDER =
  process.env.MAIL_PROVIDER ||
  (process.env.NODE_ENV === "production" ? "resend" : "smtp");

async function sendViaResend({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const from = getFromEmail();
  if (!from) throw new Error("MAIL_FROM (or ALERT_EMAIL) is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RESEND_ERROR: ${res.status} ${res.statusText} ${text}`.trim());
  }
}

function createSmtpTransporter() {
  /**
   * Keep this transporter config aligned with `test-email.js`.
   * Using `service: "gmail"` is usually more reliable than hardcoding host/ports.
   */
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_EMAIL_PASS,
    },
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 20_000,
  });
}

async function sendViaSmtp({ from, to, subject, html }) {
  const transporter = createSmtpTransporter();
  await transporter.sendMail({ from, to, subject, html });
}

async function sendEmail({ fromName, to, subject, html }) {
  const fromEmail = getFromEmail();
  const from = fromEmail ? `"${fromName}" <${fromEmail}>` : undefined;

  if (MAIL_PROVIDER === "resend") {
    await sendViaResend({ to, subject, html });
    return;
  }

  if (!from) throw new Error("MAIL_FROM (or ALERT_EMAIL) is not set");
  await sendViaSmtp({ from, to, subject, html });
}

exports.sendAlertEmail = async ({ name, email, subject, message }) => {
  const to = process.env.ADMIN_RECEIVE_EMAIL;
  const mailSubject = `New Contact Form Message: ${subject}`;
  const html = `
      <h2>New message from your portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr />
      <p>Thanks,</p>
      <p>Your Portfolio Bot 🤖</p>
    `;

  try {
    if (!to) throw new Error("ADMIN_RECEIVE_EMAIL is not set");
    await sendEmail({
      fromName: "Portfolio Alert",
      to,
      subject: mailSubject,
      html,
    });
  } catch (err) {
    console.error("Error sending alert email:", err.message);
    throw new Error(`Failed to send alert email: ${err.message}`);
  }
};
exports.sendOTPEmail = async ({ email, otp }) => {
  const subject = `Your Admin Login OTP Code`;
  const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #333; text-align: center;">Admin Login Code</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">Use the following OTP to log into the Admin panel. This code is valid for 10 minutes.</p>
        <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 6px;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `;

  try {
    await sendEmail({
      fromName: "Portfolio Admin",
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.error("Error sending OTP email:", err.message);
    throw new Error(`EMAIL_ERROR: ${err.message}`);
  }
};
