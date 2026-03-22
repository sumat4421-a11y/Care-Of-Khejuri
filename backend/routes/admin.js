const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

// Admin login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check credentials against environment variables (preset admin)
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Invalid Username' });
    }

    // Compare password hash when available. Keep legacy fallback for migration only.
    let isMatch = false;
    if (process.env.ADMIN_PASSWORD_HASH) {
      isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    } else if (process.env.ADMIN_PASSWORD) {
      isMatch = password === process.env.ADMIN_PASSWORD;
    }
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '4h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

module.exports = router;
