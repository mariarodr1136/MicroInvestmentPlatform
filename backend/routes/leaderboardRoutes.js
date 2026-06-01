const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username balance portfolio');
    const ranked = users
      .map(u => ({
        _id: u._id,
        username: u.username,
        totalValue: u.balance + u.portfolio.reduce((sum, s) => sum + s.shares * s.avgPrice, 0),
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
    res.json(ranked);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
