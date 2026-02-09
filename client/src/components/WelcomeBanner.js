import React from 'react';

const WelcomeBanner = ({ username, isLoading, error, onLogout }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-top">
        <div>
          <h1>Micro-Investment Education Platform</h1>
          {isLoading ? (
            <div className="welcome-loading"></div>
          ) : error ? (
            <p className="welcome-error">Unable to load user information</p>
          ) : username ? (
            <p className="welcome-subtitle">Welcome Back, {username}!</p>
          ) : (
            <p className="welcome-subtitle">Welcome, Guest!</p>
          )}
        </div>
        {onLogout && (
          <button className="logout-btn" onClick={onLogout}>
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeBanner;
