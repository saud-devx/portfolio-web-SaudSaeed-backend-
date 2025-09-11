const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role },   // include role
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
