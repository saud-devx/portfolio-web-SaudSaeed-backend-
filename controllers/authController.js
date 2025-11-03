// controllers/authController.js
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

// Helper function to sign a JWT
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// Middleware: Protect Route
exports.protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check session match
    if (user.currentSession !== decoded.sessionId) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Authentication failed", error: err.message });
  }
};

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const sessionId = uuidv4();
    user.currentSession = sessionId;
    await user.save();

    const token = signToken({
      id: user._id,
      role: user.role,
      sessionId,
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ✅ POST /api/v1/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "Not logged in" });
    }

    user.currentSession = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
