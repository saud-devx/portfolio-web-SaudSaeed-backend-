const express = require("express");
const router = express.Router();
const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const { authRequired, adminOnly } = require("../middleware/auth");

// Public
router.get("/", getExperiences);
router.get("/:id", getExperience);

// Admin-only
router.post("/", authRequired, adminOnly, createExperience);
router.put("/:id", authRequired, adminOnly, updateExperience);
router.delete("/:id", authRequired, adminOnly, deleteExperience);

module.exports = router;
