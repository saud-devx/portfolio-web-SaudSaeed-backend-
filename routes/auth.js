const express = require("express");
const router = express.Router();
const { logout, protect, sendOtp, verifyOtp } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", protect, logout);

module.exports = router;
