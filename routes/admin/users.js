const express = require('express');
const router = express.Router();
const { authRequired, adminOnly } = require('../../middleware/auth');
const User = require('../../models/User');

// GET /api/v1/admin/users
router.get('/', authRequired, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// POST /api/v1/admin/users
router.post('/', authRequired, adminOnly, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name: 'Admin', email, password, role: 'admin' });
    res.status(201).json({ message: 'User added', user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add user', error: err.message });
  }
});

// PATCH /api/v1/admin/users/:id
router.patch('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) user.email = email;
    if (password) user.password = password; // pre-save hook will hash it
    
    await user.save();
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE /api/v1/admin/users/:id
router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
