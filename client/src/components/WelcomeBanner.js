import React from 'react';
import logo from '../logo.png';

const WelcomeBanner = ({ username, isLoading, onLogout }) => {
  return (
    <header className="top-nav">
      <div className="nav-content">
        <div className="nav-brand">
          <img src={logo} alt="VestLab" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name">VestLab</div>
            <div className="nav-brand-sub">Micro-Investment Platform</div>
          </div>
        </div>

        <div className="nav-actions">
          {isLoading ? (
            <div className="nav-skeleton" />
          ) : username ? (
            <div className="nav-user">
              <div className="nav-avatar">{username[0].toUpperCase()}</div>
              <span className="nav-username">{username}</span>
            </div>
          ) : null}

          {onLogout && (
            <button className="logout-btn" onClick={onLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default WelcomeBanner;
