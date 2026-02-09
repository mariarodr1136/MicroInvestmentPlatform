import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, { username, password });
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const payload = { username, email, password };
      if (balance) {
        const parsed = parseFloat(balance);
        if (isNaN(parsed) || parsed < 0) {
          setError('Please enter a valid balance');
          setIsLoading(false);
          return;
        }
        payload.balance = parsed;
      }
      const response = await axios.post(`${API_URL}/api/user/register`, payload);
      onLogin({ _id: response.data._id, username: response.data.username, balance: response.data.balance });
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
    setBalance('');
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-title">Micro-Investment Education Platform</h1>
        <p className="auth-subtitle">Learn to invest with virtual money</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="number"
              placeholder="Starting Balance (default: $10,000)"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              min="0"
              step="0.01"
            />
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="auth-hint">
          {mode === 'login'
            ? "Don't have an account? Click Sign Up above."
            : 'Already have an account? Click Log In above.'}
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
