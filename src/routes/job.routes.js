import express from 'express';
const router = express.Router();
import {getJobs, deleteJob} from '../controllers/job.controller.js';

router.get('/', getJobs);
router.delete('/:id', deleteJob);

export default router;