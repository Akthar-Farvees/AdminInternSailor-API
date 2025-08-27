import  express from 'express';
const router = express.Router();
import {getUsersWithCompany, deleteCompanyUser, approveAdminApproval, updateCompanyUser} from '../controllers/company-user.controller.js';

router.get('/company-users', getUsersWithCompany);
router.delete('/delete-company-user/:CompanyUserId', deleteCompanyUser);
router.post('/approve-waiting-approval', approveAdminApproval);
router.put('/update-company-user/:CompanyUserId', updateCompanyUser);

export default router;

