const Message = require('../models/Message');
const nodemailer = require('nodemailer');
const { sendAlertEmail } = require("../helpers/sendEmail");



exports.create = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const ip = req.ip;
    const doc = await Message.create({ name, email, subject, message, ip });
    await sendAlertEmail({ name, email, subject, message });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Email failed:", err);
    next(err);
  }

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
