const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cors());

const skipLimiter = () => process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production';

// Strict limit on auth endpoints to prevent brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: skipLimiter,
});

// General limit for all other API routes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: skipLimiter,
});

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/', apiLimiter);

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

module.exports = app;
