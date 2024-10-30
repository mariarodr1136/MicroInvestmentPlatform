const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const axios = require('axios');

// Get transaction history for a user
router.get('/:userId/history', async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default to page 1, 5 transactions per page
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Buy Stock
router.post('/buy', async (req, res) => {
  const { userId, symbol, shares } = req.body;

  try {
    const user = await User.findById(userId);
    const price = await fetchStockPrice(symbol);
    const cost = shares * price;

    if (user.balance < cost) return res.status(400).json({ error: 'Insufficient funds' });

    const existingStock = user.portfolio.find(stock => stock.symbol === symbol);
    if (existingStock) {
      existingStock.shares += shares;
      existingStock.avgPrice = (existingStock.avgPrice + price) / 2;
    } else {
      user.portfolio.push({ symbol, shares, avgPrice: price });
    }

    user.balance -= cost;
    await user.save();

    const newTransaction = new Transaction({ 
      userId, 
      symbol, 
      shares, 
      pricePerShare: price, 
      type: 'buy' 
    });
    await newTransaction.save();

    res.status(200).json({ message: 'Stock purchased successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sell Stock
router.post('/sell', async (req, res) => {
  const { userId, symbol, shares } = req.body;

  try {
    console.log(`Selling stock: ${symbol}, Shares: ${shares}, User ID: ${userId}`);

    // Input validation
    if (!userId || !symbol || !shares) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the stock in user's portfolio
    const existingStock = user.portfolio.find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase());
    if (!existingStock) {
      return res.status(400).json({ error: `You don't own any shares of ${symbol}` });
    }
    if (existingStock.shares < shares) {
      return res.status(400).json({ error: `You only have ${existingStock.shares} shares of ${symbol}` });
    }

    // Fetch current stock price
    const price = await fetchStockPrice(symbol);
    if (!price) {
      return res.status(500).json({ error: 'Unable to fetch current stock price' });
    }

    const revenue = shares * price;

    // Update portfolio
    existingStock.shares -= shares;
    if (existingStock.shares === 0) {
      user.portfolio = user.portfolio.filter(stock => stock.symbol.toUpperCase() !== symbol.toUpperCase());
    }

    // Update user balance
    user.balance += revenue;
    await user.save();

    // Record transaction
    const newTransaction = new Transaction({
      userId,
      symbol: symbol.toUpperCase(),
      shares,
      pricePerShare: price,
      type: 'sell',
      buyPricePerShare: existingStock.avgPrice,
      revenue: revenue
    });
    await newTransaction.save();

    res.status(200).json({ 
      message: 'Stock sold successfully', 
      balance: user.balance,
      soldShares: shares,
      revenue: revenue
    });
  } catch (error) {
    console.error('Error during selling stock:', error);
    res.status(500).json({ error: 'An error occurred while selling stock: ' + error.message });
  }
});

// Fetch stock price helper function
async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: process.env.REACT_APP_STOCK_API_KEY, // Ensure your .env file has this key
      },
    });

    // Access the latest closing price
    const timeSeries = response.data['Time Series (5min)'];
    const latestTimestamp = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTimestamp];

    return parseFloat(latestData['4. close']); // Return the latest closing price
  } catch (error) {
    console.error('Error fetching stock price:', error.message);
    throw error; // Rethrow the error for further handling
  }
}

module.exports = router;
