require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const User = require('../models/User');

const seed = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  if (!email || !pass) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD required in env');
    process.exit(1);
  }
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const user = new User({ name: 'Admin', email, password: pass, role: 'admin' });
  await user.save();
  console.log('Admin created:', email);
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
