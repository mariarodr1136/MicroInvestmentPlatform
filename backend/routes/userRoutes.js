const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const SALT_ROUNDS = 10;

function signToken(userId) {
  return jwt.sign({ id: String(userId) }, JWT_SECRET, { expiresIn: '7d' });
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, balance } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ username, password: hashedPassword, balance: balance ?? 10000 });
    await newUser.save();
    const token = signToken(newUser._id);
    res.status(201).json({ _id: newUser._id, username: newUser.username, balance: newUser.balance, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = signToken(user._id);
    res.status(200).json({ _id: user._id, username: user.username, balance: user.balance, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user portfolio
router.get('/:userId/portfolio', auth, async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user.portfolio);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get user balance
router.get('/:userId/balance', auth, async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch balance' });
  }
});

// Get user username
router.get('/:userId/username', auth, async (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch username' });
  }
});

// Get watchlist
router.get('/:userId/watchlist', auth, async (req, res) => {
  if (req.userId !== req.params.userId) return res.status(403).json({ error: 'Access denied' });
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ watchlist: user.watchlist || [] });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Add to watchlist
router.post('/:userId/watchlist', auth, async (req, res) => {
  if (req.userId !== req.params.userId) return res.status(403).json({ error: 'Access denied' });
  try {
    const symbol = req.body.symbol?.toUpperCase();
    if (!symbol) return res.status(400).json({ error: 'Symbol required' });
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.watchlist.includes(symbol)) { user.watchlist.push(symbol); await user.save(); }
    res.json({ watchlist: user.watchlist });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Remove from watchlist
router.delete('/:userId/watchlist/:symbol', auth, async (req, res) => {
  if (req.userId !== req.params.userId) return res.status(403).json({ error: 'Access denied' });
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.watchlist = user.watchlist.filter(s => s !== req.params.symbol.toUpperCase());
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
