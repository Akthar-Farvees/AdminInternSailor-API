const express = require('express');
const router = express.Router();
const companyController = require('../controllers/dashboard.controller');

router.get('/counts', companyController.getDashboardCounts);
router.get('/today-jobs', companyController.getJobApplicationsTrend);

module.exports = router;