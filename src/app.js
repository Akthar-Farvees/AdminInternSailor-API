const express = require('express');
const cors = require('cors'); // Import cors package
const app = express();
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const companyUserRoutes = require('./routes/company-user.routes');
const companyRoutes = require('./routes/company.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const jobRoutes = require('./routes/job.routes');
const adminRoutes = require('./routes/admin.user.routes');


// Allow requests from your React app on localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's URL
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

app.use(cors(corsOptions)); 
app.use(helmet());
app.use(express.json());

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', companyUserRoutes);
app.use('/api', companyRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', jobRoutes);
app.use('/api', adminRoutes);

module.exports = app;
