import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';
import VestLabLogo from './VestLabLogo';

const DEMO = { username: 'Guest', password: 'demo123' };

const STOCKS_DATA = [
  { symbol: 'AAPL',  name: 'Apple Inc.',           price: 178.50,  change: +0.84 },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',       price: 375.00,  change: +1.12 },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',          price: 875.50,  change: +3.42 },
  { symbol: 'TSLA',  name: 'Tesla Inc.',            price: 245.00,  change: +2.15 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',         price: 141.25,  change: -0.32 },
  { symbol: 'META',  name: 'Meta Platforms',        price: 485.50,  change: +0.67 },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',       price: 150.25,  change: -0.18 },
  { symbol: 'NFLX',  name: 'Netflix Inc.',          price: 620.00,  change: +1.88 },
  { symbol: 'AMD',   name: 'Advanced Micro Dev.',   price: 165.30,  change: -1.24 },
  { symbol: 'COIN',  name: 'Coinbase Global',       price: 198.60,  change: +4.12 },
  { symbol: 'PLTR',  name: 'Palantir Tech.',        price: 22.45,   change: +1.67 },
  { symbol: 'DIS',   name: 'Walt Disney Co.',       price: 112.40,  change: -0.78 },
  { symbol: 'BABA',  name: 'Alibaba Group',         price: 85.75,   change: +0.45 },
  { symbol: 'RIVN',  name: 'Rivian Automotive',     price: 12.80,   change: -2.34 },
  { symbol: 'SPY',   name: 'SPDR S&P 500 ETF',     price: 524.80,  change: +0.52 },
  { symbol: 'QQQ',   name: 'Nasdaq-100 ETF',        price: 448.20,  change: +0.89 },
  { symbol: 'UBER',  name: 'Uber Technologies',     price: 82.30,   change: +1.43 },
  { symbol: 'SHOP',  name: 'Shopify Inc.',          price: 118.60,  change: -0.91 },
];

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 17 8 12 13 15 21 7" />
    <polyline points="17 7 21 7 21 11" />
  </svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="8" y1="14" x2="16" y2="14" />
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4" />
    <path d="M7 4H4a1 1 0 00-1 1v2a4 4 0 004 4h1" />
    <path d="M17 4h3a1 1 0 011 1v2a4 4 0 01-4 4h-1" />
    <path d="M7 4h10v7a5 5 0 01-10 0V4z" />
  </svg>
);

const IconFlask = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M9 3v7l-5 9a1 1 0 00.9 1.5h14.2a1 1 0 00.9-1.5L15 10V3" />
    <path d="M9 14h6" />
  </svg>
);

const FEATURES = [
  {
    Icon: IconChart,
    color: 'feat-blue',
    title: 'Real-Time Charts',
    desc: 'Interactive stock charts powered by live market data. Visualize price action for any ticker.',
  },
  {
    Icon: IconBriefcase,
    color: 'feat-green',
    title: 'Portfolio Tracking',
    desc: 'Monitor your holdings, P&L, and allocation. See exactly how your simulated investments perform.',
  },
  {
    Icon: IconTrophy,
    color: 'feat-amber',
    title: 'Leaderboard',
    desc: 'Compete with other traders. Rankings update live — can you top the chart?',
  },
  {
    Icon: IconFlask,
    color: 'feat-purple',
    title: 'What-If Simulator',
    desc: 'Explore hypotheticals: "What if I had bought NVDA six months ago?" Find out instantly.',
  },
];

const LandingPage = ({ onLogin }) => {
  const [stocks, setStocks] = useState(STOCKS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const loginRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev =>
        prev.map(s => {
          const delta = (Math.random() - 0.49) * 0.08;
          const newPrice = parseFloat((s.price * (1 + delta / 100)).toFixed(2));
          const newChange = parseFloat((s.change + (Math.random() - 0.49) * 0.05).toFixed(2));
          return { ...s, price: newPrice, change: newChange };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, DEMO);
      onLogin(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <VestLabLogo size={30} />
          <span className="landing-nav-logo-text">VestLab</span>
        </div>
        <button className="landing-nav-cta" onClick={scrollToLogin}>
          Sign In
        </button>
      </nav>

      {/* Scrolling Ticker */}
      <div className="landing-ticker-wrap">
        <div className="landing-ticker">
          {[...stocks, ...stocks].map((s, i) => (
            <span key={i} className="landing-ticker-item">
              <span className="landing-ticker-sym">{s.symbol}</span>
              <span className="landing-ticker-price">${s.price.toFixed(2)}</span>
              <span className={`landing-ticker-chg ${s.change >= 0 ? 'ticker-up' : 'ticker-down'}`}>
                {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-orb landing-orb-1" />
        <div className="landing-hero-orb landing-orb-2" />
        <div className="landing-hero-content">
          <div className="landing-hero-pill">Paper Trading Simulator</div>
          <h1 className="landing-hero-title">
            Trade Stocks.<br />
            <span className="landing-hero-accent">No Real Money.</span><br />
            Learn Fast.
          </h1>
          <p className="landing-hero-sub">
            VestLab is a risk-free paper trading platform where you can practice buying and selling
            stocks, track your portfolio performance, and compete on the leaderboard — all with
            simulated funds.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-btn-primary" onClick={scrollToLogin}>
              Start Trading Free
            </button>
            <div className="landing-live-badge">
              <span className="landing-live-dot" />
              Live Market Data
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="landing-features-inner">
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="landing-feature-card">
                <div className={`landing-feature-icon-wrap ${f.color}`}>
                  <f.Icon />
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Markets */}
      <section className="landing-markets">
        <div className="landing-markets-inner">
          <div className="landing-section-hdr">
            <h2 className="landing-section-title">Live Markets</h2>
            <p className="landing-section-sub">Practice trading with simulated funds</p>
          </div>
          <div className="landing-markets-grid">
            {stocks.map(s => (
              <div key={s.symbol} className={`landing-stock-card ${s.change >= 0 ? 'stock-up' : 'stock-down'}`}>
                <div className="landing-stock-top">
                  <span className="landing-stock-sym">{s.symbol}</span>
                  <span className={`landing-stock-badge ${s.change >= 0 ? 'badge-up' : 'badge-down'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                  </span>
                </div>
                <div className="landing-stock-price">${s.price.toFixed(2)}</div>
                <div className="landing-stock-name">{s.name}</div>
                <div className="landing-stock-bar">
                  <div
                    className={`landing-stock-bar-fill ${s.change >= 0 ? 'bar-up' : 'bar-down'}`}
                    style={{ width: `${Math.min(Math.abs(s.change) * 12 + 18, 92)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="landing-login-section" ref={loginRef}>
        <div className="landing-login-wrap">
          <div className="landing-login-info">
            <h2 className="landing-login-heading">Ready to start?</h2>
            <p className="landing-login-desc">
              No account needed. Log in instantly with the free demo account and explore
              the full platform — charts, trades, leaderboard, and more.
            </p>
            <ul className="landing-perks-list">
              <li>$10,000 in simulated starting funds</li>
              <li>Full access to all platform features</li>
              <li>Real stock data &amp; interactive charts</li>
              <li>Leaderboard, achievements &amp; stats</li>
            </ul>
          </div>

          <div className="landing-login-card">
            <div className="landing-card-logo-wrap">
              <VestLabLogo size={34} />
            </div>
            <h3 className="landing-card-title">VestLab</h3>
            <p className="landing-card-sub">Demo Account — Free Access</p>

            <div className="landing-creds-box">
              <p className="landing-creds-heading">Your demo credentials</p>
              <div className="landing-cred-row">
                <span className="landing-cred-key">Username</span>
                <code className="landing-cred-val">Guest</code>
              </div>
              <div className="landing-cred-row">
                <span className="landing-cred-key">Password</span>
                <code className="landing-cred-val landing-cred-pass">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</code>
              </div>
              <p className="landing-creds-note">
                Shared read-only credentials — do not change username or password
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              className="landing-enter-btn"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Enter Platform'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <VestLabLogo size={20} />
        <span className="landing-footer-name">VestLab — Paper Trading Simulator</span>
        <span className="landing-footer-legal">For educational use only. Not financial advice.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
