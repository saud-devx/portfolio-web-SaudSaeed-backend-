// utils/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // adjust
const bcrypt = require('bcrypt');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const email = process.env.ADMIN_EMAIL || 'stuartrobinson928@gmail.com';
    const pass = process.env.ADMIN_PASSWORD || 'password@123';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash(pass, 10);
    const user = await User.create({ name: 'Admin', email, password: hashed, isAdmin: true });
    console.log('Created admin:', user.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
