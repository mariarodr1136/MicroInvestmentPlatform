const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  shares: { type: Number, required: true },
  pricePerShare: { type: Number, required: true },
  buyPricePerShare: { type: Number }, 
  revenue: { type: Number }, 
  type: { type: String, enum: ['buy', 'sell'], required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
