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
    <div className="buy-stock-container p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 underline">Buy Stock</h3>
      {error && (
        <div className="error-message text-red-600 mb-3">
          {error}
        </div>
      )}
      <div className="input-group space-y-4">
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          onClick={handleBuy}
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white transition duration-200 ${
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
