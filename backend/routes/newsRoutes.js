const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy endpoint for NewsAPI to bypass CORS restrictions
router.get('/', async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=stocks&apiKey=${API_KEY}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({
      error: 'Failed to fetch news',
      message: error.message
    });
  }
});

module.exports = router;
