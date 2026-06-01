import React, { useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import '../App.css';

const BuyStock = ({ userId, onBuyComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuy = async () => {
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
        `${API_URL}/api/transactions/buy`,
        { userId, symbol: symbol.toUpperCase(), shares: shareCount },
        { headers: getAuthHeader() }
      );
      alert('Stock purchased successfully!');
      setSymbol('');
      setShares('');
      if (onBuyComplete) onBuyComplete();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to buy stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trade-form">
      <div className="section-header green">Buy Stock</div>
      <div className="section-body">
        {error && <div className="form-error">{error}</div>}
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
          <button onClick={handleBuy} disabled={isLoading} className="buy-btn">
            {isLoading ? 'Processing...' : 'Buy Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyStock;
