const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const axios = require('axios');

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

    const newTransaction = new Transaction({ userId, symbol, shares, pricePerShare: price, type: 'buy' });
    await newTransaction.save();

    res.status(200).json({ message: 'Stock purchased successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchStockPrice(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '5min',
        apikey: process.env.STOCK_API_KEY, // Ensure your .env file has this key
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
