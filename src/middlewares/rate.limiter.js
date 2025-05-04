const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Try again later.',
  statusCode: 429, // Status code for "Too Many Requests"
  headers: true,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };