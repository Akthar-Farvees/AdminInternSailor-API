const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

router.get('/companies', companyController.getCompanies);
router.get('/industries', companyController.getIndustries);
router.get('/employee-type', companyController.getEmployeeType);
router.get('/selected-industry/:id', companyController.getIndustryById);
router.put('/companies/:CompanyId', companyController.updateCompany);
router.delete('/companies/:CompanyId', companyController.deleteCompany);

module.exports = router;