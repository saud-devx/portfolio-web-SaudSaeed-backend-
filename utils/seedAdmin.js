// utils/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const pass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    // Plain password, will be hashed by pre('save') in User model
    const user = await User.create({
      name: 'Admin',
      email,
      password: pass,
      role: 'admin',
    });

    console.log('Created admin:', user.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
