// routes/admin/settings.js
const express = require('express');
const router = express.Router();
const { authRequired, adminOnly } = require('../../middleware/auth');
const Settings = require('../../models/Settings');

// Get settings (public route often exists already)
router.get('/', async (req, res) => {
  try {
    const s = await Settings.findOne({});
    res.json(s || {});
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Update settings (admin)
router.patch('/', authRequired, adminOnly, async (req, res) => {
  try {
    // update or create single document
    const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json(s);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
