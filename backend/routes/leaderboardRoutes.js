const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { fetchStockPrice } = require('../utils/stockPrice');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username balance portfolio');
    const ranked = await Promise.all(
      users.map(async (u) => {
        const stockValues = await Promise.all(
          u.portfolio.map(async (s) => {
            const price = await fetchStockPrice(s.symbol);
            return s.shares * price;
          })
        );
        const portfolioValue = stockValues.reduce((sum, v) => sum + v, 0);
        return { _id: u._id, username: u.username, totalValue: u.balance + portfolioValue };
      })
    );
    ranked.sort((a, b) => b.totalValue - a.totalValue);
    res.json(ranked.slice(0, 8));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
