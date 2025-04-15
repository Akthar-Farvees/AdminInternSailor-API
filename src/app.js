const express = require('express');
const cors = require('cors'); // Import cors package
const app = express();

// Allow requests from your React app on localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's URL
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

app.use(cors(corsOptions)); 

const userRoutes = require('./routes/user.routes');
app.use(express.json());
app.use('/api/users', userRoutes);

module.exports = app;
