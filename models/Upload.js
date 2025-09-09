const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  filename: String,
  url: String,
  mimeType: String,
  size: Number,
  altText: String,
  tags: [String],
  uploadedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Upload', UploadSchema);
