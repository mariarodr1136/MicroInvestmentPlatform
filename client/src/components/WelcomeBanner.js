import React, { useState } from 'react';
import VestLabLogo from './VestLabLogo';
import SidebarWatchlist from './SidebarWatchlist';

const NAV_SECTIONS = [
  { id: 'section-portfolio',   label: 'Portfolio',    accent: 'var(--green)' },
  { id: 'section-chart',       label: 'Chart',        accent: 'var(--blue)' },
  { id: 'section-performance', label: 'Performance',  accent: 'var(--blue)' },
  { id: 'section-buy',         label: 'Trade',        accent: 'var(--green)' },
  { id: 'section-leaderboard', label: 'Leaderboard',  accent: 'var(--amber)' },
  { id: 'section-simulator',   label: 'Simulator',    accent: 'var(--amber)' },
  { id: 'section-search',      label: 'Search',       accent: 'var(--purple)' },
  { id: 'section-history',     label: 'History',      accent: 'var(--teal)' },
];

const WelcomeBanner = ({ username, isLoading, onLogout, userId, watchlistAdd }) => {
  const [active, setActive] = useState('');

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-wrap">
          <VestLabLogo size={22} />
        </div>
        <div>
          <div className="sidebar-brand-name">VestLab</div>
          <div className="sidebar-brand-sub">Micro-Investment</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Navigation</div>
        {NAV_SECTIONS.map(({ id, label, accent }) => (
          <button
            key={id}
            className={`sidebar-nav-item${active === id ? ' active' : ''}`}
            style={{ '--nav-accent': accent }}
            onClick={() => scrollTo(id)}
          >
            <span className="sidebar-nav-dot" />
            {label}
          </button>
        ))}
      </nav>

      {userId && <SidebarWatchlist userId={userId} externalAdd={watchlistAdd} />}

      <div className="sidebar-footer">
        {isLoading ? (
          <div className="nav-skeleton" />
        ) : username ? (
          <div className="sidebar-user">
            <div className="nav-avatar">{username[0].toUpperCase()}</div>
            <div className="sidebar-user-info">
              <span className="nav-username">{username}</span>
              <span className="sidebar-user-sub">Investor</span>
            </div>
          </div>
        ) : null}
        {onLogout && (
          <button className="logout-btn sidebar-logout" onClick={onLogout}>
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
};

export default WelcomeBanner;
