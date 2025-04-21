const express = require('express');
const router = express.Router();
const companyController = require('../controllers/dashboard.controller');

router.get('/dashboard-counts', companyController.getDashboardCounts);
router.get('/job-applications-trend', companyController.getJobApplicationsTrend);

module.exports = router;