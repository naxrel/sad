const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin } = require('../utils/validators');

// In-memory user storage (for demo purposes)
const users = [];

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const validation = validateRegistration(username, password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const validation = validateLogin(username, password);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all users (for testing purposes)
router.get('/users', (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    createdAt: u.createdAt
  }));
  res.json({ users: safeUsers });
});

module.exports = router;
