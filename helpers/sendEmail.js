const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,   // 5 seconds
});

exports.sendAlertEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"Portfolio Alert" <${process.env.ALERT_EMAIL}>`,
    to: process.env.ADMIN_RECEIVE_EMAIL,
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <h2>New message from your portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr />
      <p>Thanks,</p>
      <p>Your Portfolio Bot 🤖</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending alert email:", err.message);
    throw new Error("Failed to send alert email");
  }
};
exports.sendOTPEmail = async ({ email, otp }) => {
  const mailOptions = {
    from: `"Portfolio Admin" <${process.env.ALERT_EMAIL}>`,
    to: email,
    subject: `Your Admin Login OTP Code`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #333; text-align: center;">Admin Login Code</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">Use the following OTP to log into the Admin panel. This code is valid for 10 minutes.</p>
        <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; border-radius: 6px;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending OTP email:", err.message);
    throw new Error("SMTP_ERROR: Could not send OTP email");
  }
};
