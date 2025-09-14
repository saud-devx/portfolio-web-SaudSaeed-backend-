// routes/admin/experiences.js
const express = require('express');
const router = express.Router();
const { authRequired, adminOnly } = require('../../middleware/auth');
const Experience = require('../../models/Experience');

// Create experience
router.post('/', authRequired, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    res.status(400).json({ message: 'Create failed', error: err.message });
  }
});

// Update experience
router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json(exp);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// Delete experience
router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});

// Reorder endpoint (optional)
router.post('/reorder', authRequired, adminOnly, async (req, res) => {
  try {
    // expects body: { order: ['id1','id2', ...] }
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ message: 'order must be an array of ids' });

    // Assumes Experience model has `order` or `position` field; otherwise update a 'sort' field per id
    // This example updates a numeric `sort` field according to index
    const ops = order.map((id, idx) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sort: idx } }
      }
    }));

    if (ops.length) await Experience.bulkWrite(ops);
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: 'Reorder failed', error: err.message });
  }
});
router.get('/', authRequired, adminOnly, async (req, res) => {
  try {
    const exps = await Experience.find().sort({ sort: 1, createdAt: -1 }); // sorted if you have a "sort" field
    res.json(exps);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Get one experience by ID
router.get('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

module.exports = router;
