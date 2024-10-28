import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import PopularStocks from './components/PopularStocks';
import SellStock from './components/SellStock';
import BuyStock from './components/BuyStock';
import axios from 'axios';
import './App.css';

const App = () => {
  const userId = '671ec18d92f58dc23f009b9b';
  const [balance, setBalance] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSellComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBuyComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/user/${userId}/balance`);
        if (response.data && response.data.balance !== undefined) {
          setBalance(response.data.balance);
          setError('');
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError('Failed to fetch account balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [userId, refreshTrigger]);

  return (
    <div className="App">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Micro-Investment Education Platform</h1>
        
        {error && (
          <div className="error-banner text-red-600 mb-4 p-3 bg-red-50 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading text-center py-4">Loading...</div>
        ) : (
          <>
            <Portfolio userId={userId} balance={balance} key={refreshTrigger} />
            <div className="mt-8">
              <BuyStock userId={userId} onBuyComplete={handleBuyComplete} />
            </div>
            <div className="mt-8">
              <SellStock userId={userId} onSellComplete={handleSellComplete} />
            </div>
            <div className="mt-8">
              <PopularStocks />
            </div>
            <div className="mt-8">
              <Leaderboard />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;