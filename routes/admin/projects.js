// routes/admin/projects.js
const express = require('express');
const router = express.Router();
const { authRequired, adminOnly } = require('../../middleware/auth');
const Project = require('../../models/Project');

router.post('/', authRequired, adminOnly, async (req, res) => {
  try {
    const p = await Project.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ message: 'Create failed', error: err.message });
  }
});

router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;
