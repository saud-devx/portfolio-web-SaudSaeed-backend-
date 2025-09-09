const Project = require('../models/Project');
const sanitizeHtml = require('sanitize-html');

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, tags } = req.query;
    const q = { visible: true };
    if (search) q.$text = { $search: search };
    if (tags) q.techStack = { $in: tags.split(',') };
    const items = await Project.find(q).sort({ order: 1, dateCompleted: -1 })
      .skip((page-1)*limit).limit(parseInt(limit));
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (req.body.description) req.body.description = sanitizeHtml(req.body.description);
    req.body.createdBy = req.user._id;
    const item = await Project.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.description) req.body.description = sanitizeHtml(req.body.description);
    const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.reorder = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ message: 'order must be array' });
    await Promise.all(order.map((id, idx) => Project.findByIdAndUpdate(id, { order: idx })));
    res.json({ ok: true });
  } catch (err) { next(err); }
};
