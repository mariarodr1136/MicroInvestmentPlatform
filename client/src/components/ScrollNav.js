import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'section-portfolio',   label: 'Portfolio' },
  { id: 'section-performance', label: 'Performance' },
  { id: 'section-chart',       label: 'Chart' },
  { id: 'section-buy',         label: 'Buy' },
  { id: 'section-sell',        label: 'Sell' },
  { id: 'section-simulator',   label: 'Simulator' },
  { id: 'section-search',      label: 'Search' },
  { id: 'section-watchlist',   label: 'Watchlist' },
  { id: 'section-popular',     label: 'Popular' },
  { id: 'section-leaderboard', label: 'Leaderboard' },
  { id: 'section-news',        label: 'News' },
  { id: 'section-stats',       label: 'Stats' },
  { id: 'section-history',     label: 'History' },
];

const ScrollNav = () => {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="scroll-nav" aria-label="Page sections">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          className={`scroll-nav-dot ${active === id ? 'active' : ''}`}
          onClick={() => scrollTo(id)}
          title={label}
          aria-label={label}
        >
          <span className="scroll-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default ScrollNav;
