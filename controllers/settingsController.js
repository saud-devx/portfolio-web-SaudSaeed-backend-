const Settings = require('../models/Settings');

exports.get = async (req, res, next) => {
  try {
    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create({});
    }
    res.json(s);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const s = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(s);
  } catch (err) { next(err); }
};
