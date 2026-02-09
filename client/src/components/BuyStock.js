import React, { useState, useCallback } from 'react';
import axios from 'axios';
import '../App.css'; 

const BuyStock = ({ userId, onBuyComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyConnection = useCallback(async () => {
    try {
      const userResponse = await axios.get(`http://localhost:5001/api/user/${userId}`);
      console.log('User verification:', userResponse.data);
      
      const balanceResponse = await axios.get(`http://localhost:5001/api/user/${userId}/balance`);
      console.log('Balance verification:', balanceResponse.data);
    } catch (error) {
      console.error('Connection verification failed:', error);
    }
  }, [userId]);

  React.useEffect(() => {
    verifyConnection();
  }, [verifyConnection]);

  const handleBuy = async () => {
    console.log('Attempting to buy with values:', { userId, symbol, shares });

    if (!symbol.trim()) {
      setError("Please enter a stock symbol");
      return;
    }
    if (!shares || shares <= 0) {
      setError("Please enter a valid number of shares");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Sending request to:', 'http://localhost:5001/api/transactions/buy');
      const requestData = {
        userId,
        symbol: symbol.toUpperCase(),
        shares: Number(shares)
      };
      console.log('Request data:', requestData);

      const response = await axios.post('http://localhost:5001/api/transactions/buy', requestData);
      console.log('Successful response:', response.data);

      alert("Stock purchased successfully!");
      setSymbol('');
      setShares('');
      
      if (onBuyComplete) {
        onBuyComplete();
      }
    } catch (error) {
      console.error('Detailed error information:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: 'http://localhost:5001/api/transactions/buy',
        requestData: {
          userId,
          symbol: symbol.toUpperCase(),
          shares: Number(shares)
        }
      });

      const errorMessage = error.response?.data?.error || "Failed to buy stock. Please try again.";
      setError(errorMessage);
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
            disabled={isLoading}
          />
          <button
            onClick={handleBuy}
            disabled={isLoading}
            className="buy-btn"
          >
            {isLoading ? 'Processing...' : 'Buy Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyStock;
