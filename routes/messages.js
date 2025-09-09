const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

router.post('/', rateLimit, ctrl.create);
router.get('/', protect, admin, ctrl.list);
router.get('/:id', protect, admin, ctrl.get);
router.patch('/:id', protect, admin, ctrl.update);
router.delete('/:id', protect, admin, ctrl.remove);

module.exports = router;
