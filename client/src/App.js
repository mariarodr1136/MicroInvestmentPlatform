import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import PopularStocks from './components/PopularStocks';
import SellStock from './components/SellStock';
import BuyStock from './components/BuyStock';
import WelcomeBanner from './components/WelcomeBanner';
import TransactionHistory from './components/TransactionHistory';
import LatestNews from './components/LatestNews';
import StockChart from './components/StockChart';
import AuthScreen from './components/AuthScreen';
import ScrollNav from './components/ScrollNav';
import axios from 'axios';
import API_URL, { getAuthHeader } from './config';
import './App.css';

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });
  const [balance, setBalance] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSellComplete = () => setRefreshTrigger(prev => prev + 1);
  const handleBuyComplete = () => setRefreshTrigger(prev => prev + 1);

  const handleLogin = (userData) => {
    const { token, ...userWithoutToken } = userData;
    setUser(userWithoutToken);
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
    if (token) localStorage.setItem('token', token);
    setBalance(userData.balance);
    setRefreshTrigger(0);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setBalance(0);
    setError('');
  };

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const balanceResponse = await axios.get(`${API_URL}/api/user/${user._id}/balance`, { headers: getAuthHeader() });

        if (balanceResponse.data?.balance !== undefined) {
          setBalance(balanceResponse.data.balance);
        } else {
          setError('Invalid balance data received');
        }
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          setError('Cannot connect to server. Please ensure the backend is running.');
        } else if (error.response?.status === 404) {
          setError('User not found.');
          handleLogout();
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
  }, [user?._id, refreshTrigger]);

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <WelcomeBanner
        username={user.username}
        isLoading={isLoading}
        error={error}
        onLogout={handleLogout}
      />

      {error && (
        <div className="error-banner">
          {error}
          <ul className="error-details">
            <li>The backend server is running on port 5001</li>
            <li>You have CORS enabled on your backend</li>
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
        <ScrollNav />
        <div id="section-portfolio" className="full-width-section">
          <div className="component-container">
            <Portfolio userId={user._id} balance={balance} refreshTrigger={refreshTrigger} />
          </div>
        </div>
        <div id="section-chart" className="full-width-section">
          <div className="component-container">
            <StockChart />
          </div>
        </div>
        <div className="main-content two-column">
          <div className="left-section">
            <div id="section-buy" className="component-container">
              <BuyStock userId={user._id} onBuyComplete={handleBuyComplete} />
            </div>
            <div id="section-sell" className="component-container">
              <SellStock userId={user._id} onSellComplete={handleSellComplete} />
            </div>
            <div id="section-news" className="component-container">
              <LatestNews />
            </div>
          </div>
          <div className="right-section">
            <div id="section-popular" className="component-container">
              <PopularStocks />
            </div>
            <div id="section-leaderboard" className="component-container">
              <Leaderboard />
            </div>
            <div id="section-history" className="component-container transaction-history">
              <TransactionHistory userId={user._id} />
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

const AppWithProviders = () => (
  <ToastProvider>
    <App />
  </ToastProvider>
);

export default AppWithProviders;
