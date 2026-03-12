const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  // Global / Contact
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
  apologyLetter: String,

  // Header configuration
  header: {
    logoUrl: String,
    navItems: [{
      label: String,
      href: String
    }]
  },

  // Hero configuration
  hero: {
    greeting: String,
    name: String,
    roles: [String],
    description: String,
    resumeUrl: String,
    heroImage: String
  },

  // About configuration
  about: {
    heading: String,
    description: String,
    profileImage: String,
    stats: [{
      label: String,
      value: String
    }]
  },

  // Experience configuration
  experience: {
    heading: String,
    description: String
  },

  // Skills configuration
  skills: [{
    id: String,
    label: String,
    skills: [{
      id: String,
      name: String,
      percentage: Number
    }]
  }],

  // Contact configuration
  contact: {
    email: String,
    location: String,
    showForm: { type: Boolean, default: true },
    phoneNumbers: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
