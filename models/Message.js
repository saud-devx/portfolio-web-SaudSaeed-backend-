const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  attachments: [{ url: String, filename: String }],
  ip: String,
  read: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  replied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
