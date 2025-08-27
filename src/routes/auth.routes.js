import express from 'express';
const router = express.Router();
import { login } from '../controllers/auth.controller.js';
import { loginLimiter } from '../middlewares/rate.limiter.js';

router.post('/login', loginLimiter, login);

export default router;