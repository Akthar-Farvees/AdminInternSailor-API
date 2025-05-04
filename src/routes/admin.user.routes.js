const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/admin.user.controller.js');


router.get('/:adminUserId', adminUserController.getAdminUser);
router.put('/:adminUserId', adminUserController.updateAdminUser);

module.exports = router;