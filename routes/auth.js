// routes/auth.js
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

// login (public)
router.post('/login', login);

// logout (requires valid token + session)
router.post('/logout', authRequired, logout);

module.exports = router;
