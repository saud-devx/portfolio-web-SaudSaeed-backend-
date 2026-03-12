const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

router.get('/', ctrl.get);
router.patch('/', protect, admin, ctrl.update);

module.exports = router;
