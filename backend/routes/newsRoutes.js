const express = require('express');
const axios = require('axios');
const router = express.Router();

let newsCache = null;
let newsCacheTime = 0;
const NEWS_CACHE_TTL = 30 * 60 * 1000;

router.get('/', async (req, res) => {
  if (newsCache && Date.now() - newsCacheTime < NEWS_CACHE_TTL) {
    return res.json(newsCache);
  }

  try {
    const API_KEY = process.env.NEWS_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'News API key not configured' });
    }

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=stocks&apiKey=${API_KEY}`
    );

    newsCache = response.data;
    newsCacheTime = Date.now();
    res.json(newsCache);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    if (newsCache) return res.json(newsCache);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

module.exports = router;
