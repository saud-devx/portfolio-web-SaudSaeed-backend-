const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('Testing connection to:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('SUCCESS: MongoDB connected!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: MongoDB connection error:', err.message);
    process.exit(1);
  }
};

testConnection();
