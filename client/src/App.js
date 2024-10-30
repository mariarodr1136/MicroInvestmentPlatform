import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import PopularStocks from './components/PopularStocks';
import SellStock from './components/SellStock';
import BuyStock from './components/BuyStock';
import WelcomeBanner from './components/WelcomeBanner';
import TransactionHistory from './components/TransactionHistory';
import LatestNews from './components/LatestNews'; 
import axios from 'axios';
import './App.css';

const App = () => {
  const userId = '671ec18d92f58dc23f009b9b'; 
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSellComplete = () => setRefreshTrigger(prev => prev + 1);
  const handleBuyComplete = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const balanceUrl = `http://localhost:5001/api/user/${userId}/balance`;
        const usernameUrl = `http://localhost:5001/api/user/${userId}/username`;
        
        const [balanceResponse, usernameResponse] = await Promise.all([
          axios.get(balanceUrl),
          axios.get(usernameUrl)
        ]);

        if (balanceResponse.data?.balance !== undefined) {
          setBalance(balanceResponse.data.balance);
        } else {
          setError('Invalid balance data received');
        }

        if (usernameResponse.data?.username) {
          setUsername(usernameResponse.data.username);
        } else {
          setError('Invalid username data received');
        }

      } catch (error) {
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
      <WelcomeBanner 
        username={username}
        balance={balance}
        isLoading={isLoading}
        error={error}
      />

      {error && (
        <div className="error-banner">
          {error}
          <ul className="error-details">
            <li>The backend server is running on port 5001</li>
            <li>The user ID ({userId}) exists in the database</li>
            <li>You have CORS enabled on your backend</li>
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="main-content">
          <div className="left-section">
            <div className="component-container">
              <BuyStock userId={userId} onBuyComplete={handleBuyComplete} />
            </div>
            <div className="component-container">
              <SellStock userId={userId} onSellComplete={handleSellComplete} />
            </div>
            <div className="component-container">
              <LatestNews />
            </div>
          </div>
          <div className="center-section">
            <div className="component-container wider-portfolio">
              <Portfolio userId={userId} balance={balance} key={refreshTrigger} />
            </div>
            <div className="component-container transaction-history">
              <TransactionHistory userId={userId} />
            </div>
          </div>
          <div className="right-section">
            <div className="component-container">
              <PopularStocks />
            </div>
            <div className="component-container">
              <Leaderboard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
