import express from 'express';
const router = express.Router();
import {getCompanies, getIndustries, getEmployeeType, getIndustryById, updateCompany, deleteCompany} from '../controllers/company.controller.js';

router.get('/', getCompanies);
router.get('/industries', getIndustries);
router.get('/employee/type', getEmployeeType);
router.get('/industries/:id', getIndustryById);
router.put('/:CompanyId', updateCompany);
router.delete('/:CompanyId', deleteCompany);

export default router;