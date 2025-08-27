import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Import routes
import authRoutes from './routes/auth.routes.js'
import adminUserRoutes from './routes/admin.user.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import companyUserRoutes from './routes/company.user.routes.js'
import companyRoutes from './routes/company.routes.js'
import jobRoutes from './routes/job.routes.js'

// Allow requests from your React app
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

// Middlewares
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', process.env.CLIENT_URL, 'http://localhost:5050'],
      connectSrc: ["'self'", process.env.CLIENT_URL],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/user', adminUserRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/company/users', companyUserRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/job', jobRoutes);

export default app;