const express = require('express');
const router = express.Router();
const userController = require('../controllers/company-user.controller.js');

router.get('/company-users', userController.getUsersWithCompany);
router.delete('/delete-company-user/:CompanyUserId', userController.deleteCompanyUser);
router.post('/approve-waiting-approval', userController.approveAdminApproval);
router.put('/update-company-user/:CompanyUserId', userController.updateCompanyUser);

module.exports = router;

