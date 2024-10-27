const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user portfolio
router.get('/:userId/portfolio', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.portfolio);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
