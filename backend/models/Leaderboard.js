const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  }
}, { timestamps: true });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
