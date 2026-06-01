const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const axios = require('axios');
const auth = require('../middleware/auth');

// Get transaction history for a user
router.get('/:userId/history', auth, async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { page = 1, limit = 5 } = req.query;
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buy Stock
router.post('/buy', auth, async (req, res) => {
  const { symbol, shares } = req.body;
  const userId = req.userId;

  if (!symbol || shares === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const shareCount = Number(shares);
  if (!Number.isInteger(shareCount) || shareCount <= 0) {
    return res.status(400).json({ error: 'Shares must be a positive whole number' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const price = await fetchStockPrice(symbol);
    const cost = shareCount * price;

    if (user.balance < cost) return res.status(400).json({ error: 'Insufficient funds' });

    const existingStock = user.portfolio.find(s => s.symbol === symbol.toUpperCase());
    if (existingStock) {
      existingStock.avgPrice =
        (existingStock.avgPrice * existingStock.shares + price * shareCount) /
        (existingStock.shares + shareCount);
      existingStock.shares += shareCount;
    } else {
      user.portfolio.push({ symbol: symbol.toUpperCase(), shares: shareCount, avgPrice: price });
    }

    user.balance -= cost;
    await user.save();

    await new Transaction({
      userId,
      symbol: symbol.toUpperCase(),
      shares: shareCount,
      pricePerShare: price,
      type: 'buy',
    }).save();

    res.status(200).json({ message: 'Stock purchased successfully', balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sell Stock
router.post('/sell', auth, async (req, res) => {
  const { symbol, shares } = req.body;
  const userId = req.userId;

  if (!symbol || shares === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const shareCount = Number(shares);
  if (!Number.isInteger(shareCount) || shareCount <= 0) {
    return res.status(400).json({ error: 'Shares must be a positive whole number' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingStock = user.portfolio.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (!existingStock) {
      return res.status(400).json({ error: `You don't own any shares of ${symbol}` });
    }
    if (existingStock.shares < shareCount) {
      return res.status(400).json({ error: `You only have ${existingStock.shares} shares of ${symbol}` });
    }

    const price = await fetchStockPrice(symbol);
    if (!price) return res.status(500).json({ error: 'Unable to fetch current stock price' });

    const revenue = shareCount * price;
    const buyPricePerShare = existingStock.avgPrice;

    existingStock.shares -= shareCount;
    if (existingStock.shares === 0) {
      user.portfolio = user.portfolio.filter(s => s.symbol.toUpperCase() !== symbol.toUpperCase());
    }

    user.balance += revenue;
    await user.save();

    await new Transaction({
      userId,
      symbol: symbol.toUpperCase(),
      shares: shareCount,
      pricePerShare: price,
      type: 'sell',
      buyPricePerShare,
      revenue,
    }).save();

    res.status(200).json({ message: 'Stock sold successfully', balance: user.balance, soldShares: shareCount, revenue });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while selling stock: ' + error.message });
  }
});

async function fetchStockPrice(symbol) {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: { function: 'TIME_SERIES_DAILY', symbol, apikey: apiKey },
    });

    if (response.data['Error Message']) {
      throw new Error(`Invalid stock symbol: ${symbol}`);
    }
    if (response.data['Note'] || response.data['Information']) {
      return getMockStockPrice(symbol);
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) return getMockStockPrice(symbol);

    const latestTimestamp = Object.keys(timeSeries)[0];
    return parseFloat(timeSeries[latestTimestamp]['4. close']);
  } catch (error) {
    return getMockStockPrice(symbol);
  }
}

function getMockStockPrice(symbol) {
  const mockPrices = {
    'AAPL': 178.50,
    'GOOGL': 141.25,
    'TSLA': 245.00,
    'MSFT': 375.00,
    'AMZN': 150.25,
    'META': 485.50,
    'NFLX': 620.00,
    'NVDA': 875.50,
    'BABA': 85.75,
  };
  return mockPrices[symbol.toUpperCase()] || parseFloat((Math.random() * 200 + 50).toFixed(2));
}

module.exports = router;
