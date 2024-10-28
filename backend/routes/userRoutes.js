const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
      balance: req.body.balance ?? 10000, // Default balance if not provided
    });
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
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.portfolio);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user balance
router.get('/:userId/balance', async (req, res) => {
  console.log("Fetching balance for user ID:", req.params.userId); // Log user ID
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ balance: user.balance }); // Correctly send back the balance
  } catch (error) {
    console.error("Error fetching balance:", error); 
    res.status(500).json({ error: 'Unable to fetch balance' });
  }
});


module.exports = router;
