const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

router.use(protect);

router.get('/', authorize('admin'), usersController.getAll);
router.get('/:id', authorize('admin'), usersController.getById);
router.post('/', authorize('admin'), usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', authorize('admin'), usersController.remove);

module.exports = router;
