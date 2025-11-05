const Message = require('../models/Message');
const nodemailer = require('nodemailer');

exports.create = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip;
    const doc = await Message.create({ name, email, subject, message, ip });

        // EMAIL ALERT TO YOU
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ALERT_EMAIL,
        pass: process.env.ALERT_EMAIL_PASS,
      },
    });

        await transporter.sendMail({
      from: process.env.ALERT_EMAIL,
      to: process.env.ADMIN_RECEIVE_EMAIL,
      subject: "📬 New Contact Message",
      html: `
        <h3>New message from your portfolio Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>${message}</p>
      `
    });

    // TODO: send email notification via SendGrid/Nodemailer
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { unread } = req.query;
    const q = {};
    if (unread === 'true') q.read = false;
    const items = await Message.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Message.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};
