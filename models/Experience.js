const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null = still working
  description: { type: String },
  technologies: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
