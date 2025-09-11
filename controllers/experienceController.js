const Experience = require('../models/Experience');

// GET all
exports.getExperiences = async (req, res, next) => {
  try {
    const exps = await Experience.find().sort({ startDate: -1 });
    res.json(exps);
  } catch (err) {
    next(err);
  }
};

// GET single
exports.getExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

// CREATE
exports.createExperience = async (req, res, next) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
