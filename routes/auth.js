const express = require("express");
const router = express.Router();
const { login, logout, protect } = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", protect, logout);

module.exports = router;
