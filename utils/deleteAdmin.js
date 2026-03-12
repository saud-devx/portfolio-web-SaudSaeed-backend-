require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    
    console.log(`Deleting existing admin user: ${email}...`);
    await User.deleteOne({ email });
    
    console.log('Done. Exiting...');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
