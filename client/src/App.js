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
import MarketIndices from './components/MarketIndices';
import StockSearch from './components/StockSearch';
import WhatIfSimulator from './components/WhatIfSimulator';
import Watchlist from './components/Watchlist';
import PortfolioPerformance from './components/PortfolioPerformance';
import UserStats from './components/UserStats';
import Achievements from './components/Achievements';
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
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistAdd, setWatchlistAdd] = useState(null);

  const handleSellComplete = () => setRefreshTrigger(prev => prev + 1);
  const handleBuyComplete  = () => setRefreshTrigger(prev => prev + 1);

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
        const res = await axios.get(`${API_URL}/api/user/${user._id}/balance`, { headers: getAuthHeader() });
        if (res.data?.balance !== undefined) setBalance(res.data.balance);
        else setError('Invalid balance data received');
      } catch (err) {
        if (err.code === 'ECONNREFUSED') setError('Cannot connect to server.');
        else if (err.response?.status === 404) { setError('User not found.'); handleLogout(); }
        else if (err.response?.status === 500) setError('Server error. Please try again later.');
        else setError(`Failed to fetch user data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [user?._id, refreshTrigger]);

  // Keep a local watchlist copy so StockSearch can read it
  useEffect(() => {
    if (!user) return;
    axios.get(`${API_URL}/api/user/${user._id}/watchlist`, { headers: getAuthHeader() })
      .then(r => setWatchlist(r.data.watchlist || []))
      .catch(() => {});
  }, [user?._id]);

  const handleAddToWatchlist = (symbol) => {
    setWatchlist(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
    setWatchlistAdd(symbol);
    setTimeout(() => setWatchlistAdd(null), 100);
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="App">
      <WelcomeBanner username={user.username} isLoading={isLoading} error={error} onLogout={handleLogout} />
      <MarketIndices />

      {error && (
        <div className="error-banner">
          {error}
          <ul className="error-details">
            <li>Check that the backend server is running on port 5001</li>
            <li>Check that CORS is enabled</li>
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
        <ScrollNav />

        {/* Portfolio */}
        <div id="section-portfolio" className="full-width-section">
          <div className="component-container">
            <Portfolio userId={user._id} balance={balance} refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Portfolio Performance */}
        <div id="section-performance" className="full-width-section">
          <div className="component-container">
            <PortfolioPerformance userId={user._id} balance={balance} />
          </div>
        </div>

        {/* Chart + Trade sidebar */}
        <div className="layout-chart-trade">
          <div id="section-chart" className="component-container layout-chart-main">
            <StockChart />
          </div>
          <div className="layout-trade-side">
            <div id="section-buy" className="component-container">
              <BuyStock userId={user._id} onBuyComplete={handleBuyComplete} />
            </div>
            <div id="section-sell" className="component-container">
              <SellStock userId={user._id} onSellComplete={handleSellComplete} />
            </div>
            <div id="section-search" className="component-container">
              <StockSearch userId={user._id} onAddToWatchlist={handleAddToWatchlist} watchlist={watchlist} />
            </div>
          </div>
        </div>

        {/* What-if Simulator + Watchlist */}
        <div className="layout-two-col">
          <div id="section-simulator" className="component-container">
            <WhatIfSimulator />
          </div>
          <div id="section-watchlist" className="component-container">
            <Watchlist userId={user._id} externalAdd={watchlistAdd} />
          </div>
        </div>

        {/* Popular | Leaderboard | News */}
        <div className="layout-three-col">
          <div id="section-popular" className="component-container">
            <PopularStocks />
          </div>
          <div id="section-leaderboard" className="component-container">
            <Leaderboard />
          </div>
          <div id="section-news" className="component-container">
            <LatestNews />
          </div>
        </div>

        {/* Stats + Achievements */}
        <div className="layout-two-col">
          <div id="section-stats" className="component-container">
            <UserStats userId={user._id} />
          </div>
          <div id="section-achievements" className="component-container">
            <Achievements userId={user._id} />
          </div>
        </div>

        {/* Transactions */}
        <div className="full-width-section">
          <div id="section-history" className="component-container">
            <TransactionHistory userId={user._id} />
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
