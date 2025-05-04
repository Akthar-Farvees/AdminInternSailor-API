const express = require('express');
const router = express.Router();
const companyUserController = require('../controllers/company.user.controller');


router.get('/', companyUserController.getUsersWithCompany);
router.delete('/:CompanyUserId', companyUserController.deleteCompanyUser);
router.post('/approval', companyUserController.approveAdminApproval);
router.put('/:CompanyUserId', companyUserController.updateCompanyUser);

module.exports = router;

