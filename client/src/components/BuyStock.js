import React, { useState, useCallback } from 'react';
import axios from 'axios';

const BuyStock = ({ userId, onBuyComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyConnection = useCallback(async () => {
    try {
      // Verify user exists
      const userResponse = await axios.get(`http://localhost:5001/api/user/${userId}`);
      console.log('User verification:', userResponse.data);
      
      // Verify server connection
      const balanceResponse = await axios.get(`http://localhost:5001/api/user/${userId}/balance`);
      console.log('Balance verification:', balanceResponse.data);
    } catch (error) {
      console.error('Connection verification failed:', error);
    }
  }, [userId]);

  // Run verification on component mount
  React.useEffect(() => {
    verifyConnection();
  }, [verifyConnection]);

  const handleBuy = async () => {
    // Debug log - Input values
    console.log('Attempting to buy with values:', {
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
      console.log('Sending request to:', 'http://localhost:5001/api/transactions/buy');
      
      const requestData = {
        userId,
        symbol: symbol.toUpperCase(),
        shares: Number(shares)
      };
      
      console.log('Request data:', requestData);

      const response = await axios.post('http://localhost:5001/api/transactions/buy', requestData);
      
      // Debug log - Successful response
      console.log('Successful response:', response.data);

      alert("Stock purchased successfully!");
      setSymbol('');
      setShares('');
      
      if (onBuyComplete) {
        onBuyComplete();
      }
    } catch (error) {
      // Enhanced error logging
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
    <div className="buy-stock-container p-4 border rounded">
      <h3>Buy Stock</h3>
      {error && (
        <div className="error-message text-red-500 mb-3">
          {error}
        </div>
      )}
      <div className="input-group space-y-3">
        <input
          type="text"
          placeholder="Stock Symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => {
            const value = e.target.value;
            console.log('Symbol input changed:', value);
            setSymbol(value);
          }}
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Number of Shares"
          value={shares}
          onChange={(e) => {
            const value = e.target.value;
            console.log('Shares input changed:', value);
            setShares(value);
          }}
          min="1"
          disabled={isLoading}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleBuy}
          disabled={isLoading}
          className={`w-full p-2 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Buy'}
        </button>
      </div>
    </div>
  );
};

export default BuyStock;