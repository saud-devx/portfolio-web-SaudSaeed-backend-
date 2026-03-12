// routes/admin/uploads.js
const express = require('express');
const router = express.Router();
const { authRequired, adminOnly } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// configure multer storage (local disk)
// adjust destination path to your project public/uploads or similar
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/', authRequired, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`; // adjust if you serve from public
    // Optionally store upload metadata in DB
    res.status(201).json({ filename: req.file.filename, url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
