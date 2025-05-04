const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

router.get('/', companyController.getCompanies);
router.get('/industries', companyController.getIndustries);
router.get('/employee/type', companyController.getEmployeeType);
router.get('/industries/:id', companyController.getIndustryById);
router.put('/:CompanyId', companyController.updateCompany);
router.delete('/:CompanyId', companyController.deleteCompany);

module.exports = router;