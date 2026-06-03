import './Portfolio.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import { useToast } from '../context/ToastContext';
import PortfolioAllocation from './PortfolioAllocation';

const Portfolio = ({ userId, balance, refreshTrigger }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState({});
  const showToast = useToast();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/user/${userId}/portfolio`, { headers: getAuthHeader() });
        const data = response.data;
        setPortfolio(data);
        const prices = await Promise.all(
          data.map(s =>
            axios.get(`${API_URL}/api/stocks/price/${s.symbol}`, { headers: getAuthHeader() })
              .then(r => [s.symbol, r.data.price])
              .catch(() => [s.symbol, null])
          )
        );
        setCurrentPrices(Object.fromEntries(prices));
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId, refreshTrigger, showToast]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [portfolio]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 280;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h3 className="portfolio-title">Your Portfolio</h3>
        <div className="portfolio-summary">
          <div className="summary-item">
            <span className="summary-label">Balance</span>
            <span className="summary-value">${balance ? balance.toFixed(2) : '0.00'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Holdings</span>
            <span className="summary-value">{portfolio.length} stocks</span>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="portfolio-scroll">
          {[1, 2, 3].map(i => (
            <div className="stock-card skeleton-card" key={i}>
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>
      ) : portfolio.length === 0 ? (
        <div className="empty-portfolio">
          <p>No shares in your portfolio.</p>
          <p className="hint">Start by buying some stocks!</p>
        </div>
      ) : (
        <div className="portfolio-carousel">
          {canScrollLeft && (
            <button className="carousel-arrow carousel-arrow-left" onClick={() => scroll('left')} aria-label="Scroll left">
              &#8249;
            </button>
          )}
          <div className="portfolio-scroll" ref={scrollRef} onScroll={handleScroll}>
            {portfolio.map(stock => {
              const cur = currentPrices[stock.symbol];
              const pnlPct = cur != null && stock.avgPrice
                ? ((cur - stock.avgPrice) / stock.avgPrice) * 100
                : null;
              const pnlAbs = cur != null ? (cur - stock.avgPrice) * stock.shares : null;
              return (
                <div className="stock-card" key={stock.symbol}>
                  <div className="stock-header">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <span className="stock-shares">{stock.shares} shares</span>
                  </div>
                  {pnlPct != null && (
                    <div className={`pnl-badge ${pnlPct >= 0 ? 'pnl-up' : 'pnl-down'}`}>
                      {pnlPct >= 0 ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(2)}%
                      <span className="pnl-abs"> ({pnlAbs >= 0 ? '+' : ''}${pnlAbs.toFixed(2)})</span>
                    </div>
                  )}
                  <div className="stock-details">
                    <div className="detail-row">
                      <span className="detail-label">Avg Price</span>
                      <span className="detail-value">${stock.avgPrice ? stock.avgPrice.toFixed(2) : 'N/A'}</span>
                    </div>
                    {cur != null && (
                      <div className="detail-row">
                        <span className="detail-label">Current</span>
                        <span className="detail-value">${cur.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">Market Value</span>
                      <span className="detail-value">
                        ${cur != null ? (stock.shares * cur).toFixed(2) : (stock.avgPrice ? (stock.shares * stock.avgPrice).toFixed(2) : 'N/A')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {canScrollRight && (
            <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll('right')} aria-label="Scroll right">
              &#8250;
            </button>
          )}
        </div>
      )}
      {portfolio.length > 0 && !loading && (
        <div className="portfolio-allocation-section">
          <h4 className="allocation-heading">Allocation</h4>
          <PortfolioAllocation portfolio={portfolio} currentPrices={currentPrices} />
        </div>
      )}
    </div>
  );
};

export default Portfolio;
