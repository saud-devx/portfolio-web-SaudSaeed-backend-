const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/experienceController');
const { protect, admin } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', protect, admin, ctrl.create);
router.patch('/:id', protect, admin, ctrl.update);
router.delete('/:id', protect, admin, ctrl.remove);
router.post('/reorder', protect, admin, ctrl.reorder);

module.exports = router;
