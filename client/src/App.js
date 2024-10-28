import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import PopularStocks from './components/PopularStocks';
import SellStock from './components/SellStock';
import BuyStock from './components/BuyStock';
import WelcomeBanner from './components/WelcomeBanner';
import axios from 'axios';
import './App.css';

const App = () => {
  const userId = '671ec18d92f58dc23f009b9b'; 
  const [username, setUsername] = useState('');
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
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // First, check if the backend is reachable
        const balanceUrl = `http://localhost:5001/api/user/${userId}/balance`;
        const usernameUrl = `http://localhost:5001/api/user/${userId}/username`;
        
        console.log('Fetching balance from:', balanceUrl);
        console.log('Fetching username from:', usernameUrl);

        const [balanceResponse, usernameResponse] = await Promise.all([
          axios.get(balanceUrl),
          axios.get(usernameUrl)
        ]);

        console.log('Balance response:', balanceResponse.data);
        console.log('Username response:', usernameResponse.data);

        if (balanceResponse.data?.balance !== undefined) {
          setBalance(balanceResponse.data.balance);
        } else {
          console.error('Balance data is undefined');
          setError('Invalid balance data received');
        }

        if (usernameResponse.data?.username) {
          setUsername(usernameResponse.data.username);
        } else {
          console.error('Username data is undefined');
          setError('Invalid username data received');
        }

      } catch (error) {
        console.error("Detailed error:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });

        if (error.code === 'ECONNREFUSED') {
          setError('Cannot connect to server. Please ensure the backend is running.');
        } else if (error.response?.status === 404) {
          setError('User not found. Please check the user ID.');
        } else if (error.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Failed to fetch user data: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, refreshTrigger]);

  return (
    <div className="App">
      <div className="container mx-auto px-4 py-8">
        <WelcomeBanner 
          username={username}
          isLoading={isLoading}
          error={error}
        />

        {error && (
          <div className="error-banner text-red-600 mb-4 p-3 bg-red-50 rounded">
            {error}
            <div className="text-sm mt-2">
              Please ensure:
              <ul className="list-disc ml-5">
                <li>The backend server is running on port 5001</li>
                <li>The user ID ({userId}) exists in the database</li>
                <li>You have CORS enabled on your backend</li>
              </ul>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="loading text-center py-4">Loading...</div>
        ) : (
          <div className="main-content flex justify-between">
            <div className="left-section">
              <Portfolio userId={userId} balance={balance} key={refreshTrigger} />
            </div>
            <div className="center-section flex flex-col items-center space-y-8">
              <PopularStocks />
              <Leaderboard />
            </div>
            <div className="right-section space-y-8">
              <BuyStock userId={userId} onBuyComplete={handleBuyComplete} />
              <SellStock userId={userId} onSellComplete={handleSellComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;