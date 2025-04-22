const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/admin.user.controller.js');

router.get('/admin-user/:adminUserId', adminUserController.getAdminUser);
router.put('/update-password/:AdminUserID', adminUserController.updateAdminUser);

module.exports = router;