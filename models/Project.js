const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: String,
  description: String,
  features: [String],
  techStack: [String],
  repoUrl: String,
  liveUrl: String,
  images: [{ url: String, alt: String }],
  coverImage: { url: String, alt: String },
  role: String,
  client: String,
  dateCompleted: Date,
  pinned: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
