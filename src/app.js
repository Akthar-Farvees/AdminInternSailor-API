const express = require('express');
const cors = require('cors'); // Import cors package
const app = express();
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');

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

module.exports = app;
