const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
