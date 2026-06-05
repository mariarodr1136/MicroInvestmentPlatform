const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

module.exports = app;
