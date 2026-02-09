import './Portfolio.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';

const Portfolio = ({ userId, balance }) => {
  const [portfolio, setPortfolio] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(``${API_URL}`/api/user/${userId}/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, [userId]);

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
      {portfolio.length === 0 ? (
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
            {portfolio.map(stock => (
              <div className="stock-card" key={stock.symbol}>
                <div className="stock-header">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="stock-shares">{stock.shares} shares</span>
                </div>
                <div className="stock-details">
                  <div className="detail-row">
                    <span className="detail-label">Avg Price</span>
                    <span className="detail-value">${stock.avgPrice ? stock.avgPrice.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Value</span>
                    <span className="detail-value">${stock.avgPrice ? (stock.shares * stock.avgPrice).toFixed(2) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {canScrollRight && (
            <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll('right')} aria-label="Scroll right">
              &#8250;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
