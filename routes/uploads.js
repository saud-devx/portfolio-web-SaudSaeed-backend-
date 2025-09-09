const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, ctrl.mw, ctrl.uploadFile);
router.delete('/:id', protect, admin, ctrl.deleteFile);
router.get('/:id', async (req, res) => {
  // optional: return metadata
  const Upload = require('../models/Upload');
  const doc = await Upload.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

module.exports = router;
