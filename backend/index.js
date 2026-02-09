const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to log header size
app.use((req, res, next) => {
  const headerSize = JSON.stringify(req.headers).length;
  console.log('Header Size:', headerSize);
  next();
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Use Routes
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Start with in-memory MongoDB
async function startServer() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
  console.log('In-memory MongoDB connected');

  // Seed demo data
  const User = require('./models/User');
  const Transaction = require('./models/Transaction');

  const demoUser = await User.create({
    username: 'maria',
    email: 'maria@demo.com',
    password: 'demo123',
    balance: 8450.75,
    portfolio: [
      { symbol: 'AAPL', shares: 5, avgPrice: 178.50 },
      { symbol: 'GOOGL', shares: 2, avgPrice: 141.25 },
      { symbol: 'TSLA', shares: 3, avgPrice: 245.00 },
    ],
  });

  await User.create({
    username: 'alex_trader',
    email: 'alex@demo.com',
    password: 'demo123',
    balance: 12300.00,
    portfolio: [{ symbol: 'MSFT', shares: 10, avgPrice: 375.00 }],
  });

  await User.create({
    username: 'investPro',
    email: 'pro@demo.com',
    password: 'demo123',
    balance: 15000.00,
    portfolio: [],
  });

  await Transaction.create([
    { userId: demoUser._id, symbol: 'AAPL', shares: 5, pricePerShare: 178.50, type: 'buy' },
    { userId: demoUser._id, symbol: 'GOOGL', shares: 2, pricePerShare: 141.25, type: 'buy' },
    { userId: demoUser._id, symbol: 'TSLA', shares: 3, pricePerShare: 245.00, type: 'buy' },
  ]);

  console.log(`Demo user ID: ${demoUser._id} (use this to test)`);

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer().catch(err => console.error('Failed to start server:', err));
