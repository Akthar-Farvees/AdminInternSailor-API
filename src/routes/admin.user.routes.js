import express from 'express';
const router = express.Router();
import {getAdminUser, updateAdminUser} from '../controllers/admin.user.controller.js';


router.get('/:adminUserId', getAdminUser);
router.put('/:adminUserId', updateAdminUser);

export default router;