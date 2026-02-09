import React, { useState, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config';
import '../App.css'; 

const SellStock = ({ userId, onSellComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyConnection = useCallback(async () => {
    try {
      // Verify user exists
      const userResponse = await axios.get(`${API_URL}/api/user/${userId}`);
      console.log('User verification:', userResponse.data);
      
      // Verify server connection
      const balanceResponse = await axios.get(`${API_URL}/api/user/${userId}/balance`);
      console.log('Balance verification:', balanceResponse.data);
    } catch (error) {
      console.error('Connection verification failed:', error);
    }
  }, [userId]);

  // Run verification on component mount
  React.useEffect(() => {
    verifyConnection();
  }, [verifyConnection]);

  const handleSell = async () => {
    // Debug log - Input values
    console.log('Attempting to sell with values:', {
      userId,
      symbol,
      shares,
    });

    // Input validation
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
      // Debug log - API request
      console.log('Sending request to:', `${API_URL}/api/transactions/sell`);
      
      const requestData = {
        userId,
        symbol: symbol.toUpperCase(),
        shares: Number(shares)
      };
      
      console.log('Request data:', requestData);

      const response = await axios.post(API_URL + '/api/transactions/sell', requestData);
      
      // Debug log - Successful response
      console.log('Successful response:', response.data);

      alert("Stock sold successfully!");
      setSymbol('');
      setShares('');
      
      if (onSellComplete) {
        onSellComplete();
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Detailed error information:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: `${API_URL}/api/transactions/sell`,
        requestData: {
          userId,
          symbol: symbol.toUpperCase(),
          shares: Number(shares)
        }
      });

      const errorMessage = error.response?.data?.error || "Failed to sell stock. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="trade-form">
      <div className="section-header red">Sell Stock</div>
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
            onClick={handleSell}
            disabled={isLoading}
            className="sell-btn"
          >
            {isLoading ? 'Selling...' : 'Sell Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellStock;
