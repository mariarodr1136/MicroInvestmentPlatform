const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');

dotenv.config();

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
      watchlist: ['META', 'AMD', 'NFLX'],
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

    await User.create({
      username: 'bull_run99',
      password: demoPassword,
      balance: 6800.00,
      portfolio: [
        { symbol: 'NVDA', shares: 5, avgPrice: 680.00 },
        { symbol: 'AMD',  shares: 8, avgPrice: 155.00 },
      ],
    });

    await User.create({
      username: 'MarketWizard',
      password: demoPassword,
      balance: 9500.00,
      portfolio: [
        { symbol: 'AAPL', shares: 12, avgPrice: 178.50 },
        { symbol: 'AMZN', shares: 3,  avgPrice: 165.50 },
      ],
    });

    await User.create({
      username: 'divvy_queen',
      password: demoPassword,
      balance: 11200.00,
      portfolio: [
        { symbol: 'JPM', shares: 20, avgPrice: 205.00 },
        { symbol: 'V',   shares: 10, avgPrice: 275.00 },
      ],
    });

    await User.create({
      username: 'crypto_convert',
      password: demoPassword,
      balance: 4200.00,
      portfolio: [
        { symbol: 'COIN', shares: 6, avgPrice: 220.00 },
        { symbol: 'PLTR', shares: 50, avgPrice: 25.00 },
      ],
    });

    await User.create({
      username: 'steady_eddie',
      password: demoPassword,
      balance: 7750.00,
      portfolio: [
        { symbol: 'WMT', shares: 15, avgPrice: 70.00 },
        { symbol: 'DIS', shares: 10, avgPrice: 110.00 },
      ],
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
