const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteTitle: String,
  name: String,
  shortBio: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  backgroundAudioUrl: String,
  emojis: [String],
  apologyLetter: String
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
