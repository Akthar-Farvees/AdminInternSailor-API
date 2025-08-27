import express from 'express';
const router = express.Router();
import {getUsersWithCompany, deleteCompanyUser, approveAdminApproval, updateCompanyUser} from '../controllers/company.user.controller.js';


router.get('/', getUsersWithCompany);
router.delete('/:CompanyUserId', deleteCompanyUser);
router.post('/approval', approveAdminApproval);
router.put('/:CompanyUserId', updateCompanyUser);

export default router;

