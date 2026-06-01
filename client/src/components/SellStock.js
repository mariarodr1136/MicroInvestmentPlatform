import React, { useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import '../App.css';

const SellStock = ({ userId, onSellComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSell = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    const shareCount = Number(shares);
    if (!shares || !Number.isInteger(shareCount) || shareCount <= 0) {
      setError('Please enter a valid whole number of shares');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_URL}/api/transactions/sell`,
        { userId, symbol: symbol.toUpperCase(), shares: shareCount },
        { headers: getAuthHeader() }
      );
      setSuccess(`Sold ${shareCount} share${shareCount > 1 ? 's' : ''} of ${symbol.toUpperCase()}`);
      setTimeout(() => setSuccess(''), 3000);
      setSymbol('');
      setShares('');
      if (onSellComplete) onSellComplete();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to sell stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trade-form">
      <div className="section-header red">Sell Stock</div>
      <div className="section-body">
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <div className="input-group">
          <input
            type="text"
            placeholder="Stock Symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            disabled={isLoading}
          />
          <input
            type="number"
            placeholder="Number of Shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            min="1"
            step="1"
            disabled={isLoading}
          />
          <button onClick={handleSell} disabled={isLoading} className="sell-btn">
            {isLoading ? 'Selling...' : 'Sell Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellStock;
