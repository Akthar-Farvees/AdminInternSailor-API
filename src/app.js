const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminUserRoutes = require('./routes/admin.user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const companyUserRoutes = require('./routes/company.user.routes');
const companyRoutes = require('./routes/company.routes');
const jobRoutes = require('./routes/job.routes');

// Allow requests from your React app
const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's URL
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

// Middlewares
app.use(cors(corsOptions)); 
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/user', adminUserRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/company/users', companyUserRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/job', jobRoutes);

module.exports = app;