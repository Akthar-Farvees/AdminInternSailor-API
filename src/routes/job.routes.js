const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.get('/jobs', jobController.getJobs);
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;