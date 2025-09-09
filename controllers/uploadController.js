const Upload = require('../models/Upload');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substr(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.mw = upload.single('file');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const doc = await Upload.create({
      filename: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user ? req.user._id : null
    });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const doc = await Upload.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    // delete file from disk (if local)
    const filePath = path.join(uploadDir, doc.url.split('/').pop());
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Upload.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};
