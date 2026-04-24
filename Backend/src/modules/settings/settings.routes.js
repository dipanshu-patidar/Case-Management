const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

router.get('/', protect, authorize('admin'), settingsController.getSettings);
router.put('/', protect, authorize('admin'), settingsController.updateSettings);

module.exports = router;
