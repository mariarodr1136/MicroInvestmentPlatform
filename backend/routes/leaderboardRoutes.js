const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Fetch leaderboard
router.get('/', async (req, res) => {
  try {
    const leaders = await User.find()
      .sort({ balance: -1 }) // Sort users by balance in descending order
      .limit(10) // Limit to top 10 users
      .select('username balance'); // Select only username and balance fields
    res.json(leaders);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
