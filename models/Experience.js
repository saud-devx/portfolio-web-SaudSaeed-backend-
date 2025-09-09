const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
  responsibilities: [String],
  tags: [String],
  logoUrl: String,
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
