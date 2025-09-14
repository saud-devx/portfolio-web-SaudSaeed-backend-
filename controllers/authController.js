// controllers/authController.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // create a one-time session id and save to user
    const sessionId = uuidv4();
    user.currentSession = sessionId;
    await user.save();

    const token = signToken({ id: user._id, role: user.role, sessionId });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/logout
exports.logout = async (req, res, next) => {
  try {
    // expects Authorization header; middleware will have validated req.user
    const userId = req.user && req.user._id;
    if (!userId) return res.status(400).json({ message: 'Not logged in' });

    await User.findByIdAndUpdate(userId, { currentSession: null });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
