import express from 'express';
const router = express.Router();
import {getDashboardCounts, getJobApplicationsTrend} from '../controllers/dashboard.controller.js';

router.get('/counts', getDashboardCounts);
router.get('/today-jobs', getJobApplicationsTrend);

export default router;