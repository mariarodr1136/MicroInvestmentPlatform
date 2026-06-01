const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const newsRoutes = require('./routes/newsRoutes');
const stockRoutes = require('./routes/stockRoutes');

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Micro-Investment Platform API is running',
    database: dbReady ? 'ready' : 'initializing',
    endpoints: {
      users: '/api/user',
      transactions: '/api/transactions',
      leaderboard: '/api/leaderboard',
      news: '/api/news'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: dbReady ? 'ready' : 'initializing', timestamp: new Date().toISOString() });
});

// Use Routes
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/stocks', stockRoutes);

let dbReady = false;

async function startServer() {
  try {
    console.log('Starting MongoDB Memory Server...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
    console.log('In-memory MongoDB connected');

    const User = require('./models/User');
    const Transaction = require('./models/Transaction');

    const demoPassword = await bcrypt.hash('demo123', 10);

    const demoUser = await User.create({
      username: 'Guest',
      password: demoPassword,
      balance: 8450.75,
      portfolio: [
        { symbol: 'AAPL', shares: 5, avgPrice: 178.50 },
        { symbol: 'GOOGL', shares: 2, avgPrice: 141.25 },
        { symbol: 'TSLA', shares: 3, avgPrice: 245.00 },
        { symbol: 'MSFT', shares: 4, avgPrice: 375.00 },
        { symbol: 'AMZN', shares: 2, avgPrice: 165.50 },
        { symbol: 'NVDA', shares: 1, avgPrice: 680.00 },
      ],
    });

    await User.create({
      username: 'alex_trader',
      password: demoPassword,
      balance: 12300.00,
      portfolio: [{ symbol: 'MSFT', shares: 10, avgPrice: 375.00 }],
    });

    await User.create({
      username: 'investPro',
      password: demoPassword,
      balance: 15000.00,
      portfolio: [],
    });

    await Transaction.create([
      { userId: demoUser._id, symbol: 'AAPL', shares: 5, pricePerShare: 178.50, type: 'buy' },
      { userId: demoUser._id, symbol: 'GOOGL', shares: 2, pricePerShare: 141.25, type: 'buy' },
      { userId: demoUser._id, symbol: 'TSLA', shares: 3, pricePerShare: 245.00, type: 'buy' },
      { userId: demoUser._id, symbol: 'MSFT', shares: 4, pricePerShare: 375.00, type: 'buy' },
      { userId: demoUser._id, symbol: 'AMZN', shares: 2, pricePerShare: 165.50, type: 'buy' },
      { userId: demoUser._id, symbol: 'NVDA', shares: 1, pricePerShare: 680.00, type: 'buy' },
    ]);

    dbReady = true;
    console.log('Database seeding complete. API is ready!');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Initializing database...');
  startServer().catch(err => console.error('Database initialization error:', err));
});
