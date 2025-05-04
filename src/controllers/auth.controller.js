const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma.config');
const { comparePassword } = require('../utils/hash.utils');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user using Prisma with correct model name `adminusers`
    const user = await prisma.adminusers.findUnique({
      where: {
        Username: username  // Use 'Username' as it is defined in the schema
      }
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password using bcrypt
    const isMatch = await comparePassword(password, user.Password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const payload = {
      id: user.AdminUserID,
      username: user.Username,
      email: user.Email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.AdminUserID,
        name: `${user.FirstName} ${user.LastName}`,
        username: user.Username,
        email: user.Email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
