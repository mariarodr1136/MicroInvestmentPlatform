const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { fetchStockPrice } = require('../utils/stockPrice');

// GET /api/stocks/price/:symbol — returns current price for one symbol
router.get('/price/:symbol', auth, async (req, res) => {
  try {
    const price = await fetchStockPrice(req.params.symbol);
    res.json({ symbol: req.params.symbol.toUpperCase(), price });
  } catch {
    res.status(500).json({ error: 'Unable to fetch price' });
  }
});

module.exports = router;
