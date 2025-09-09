const Experience = require('../models/Experience');
const sanitizeHtml = require('sanitize-html');

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const q = { visible: true };
    if (search) q.$text = { $search: search };
    const items = await Experience.find(q).sort({ order: 1, startDate: -1 })
      .skip((page-1)*limit).limit(parseInt(limit));
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (req.body.description) req.body.description = sanitizeHtml(req.body.description);
    req.body.createdBy = req.user._id;
    const item = await Experience.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.description) req.body.description = sanitizeHtml(req.body.description);
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.reorder = async (req, res, next) => {
  try {
    const { order } = req.body; // array of ids
    if (!Array.isArray(order)) return res.status(400).json({ message: 'order must be array' });
    await Promise.all(order.map((id, idx) => Experience.findByIdAndUpdate(id, { order: idx })));
    res.json({ ok: true });
  } catch (err) { next(err); }
};
