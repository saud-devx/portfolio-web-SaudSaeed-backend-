const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
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

  await transporter.sendMail(mailOptions);
};
