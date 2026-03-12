const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

const testEmail = async () => {
  console.log('Testing email sending...');
  console.log('Email:', process.env.ALERT_EMAIL);
  // NOT printing password for security
  
  try {
    await transporter.sendMail({
      from: process.env.ALERT_EMAIL,
      to: process.env.ALERT_EMAIL,
      subject: 'Test connection',
      text: 'Test message'
    });
    console.log('SUCCESS: Email sent!');
  } catch (err) {
    console.error('FAILURE: Email error:', err.message);
  }
  process.exit(0);
};

testEmail();
