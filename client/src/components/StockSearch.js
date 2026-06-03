import React, { useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';

const StockSearch = ({ userId, onAddToWatchlist, watchlist = [] }) => {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const sym = symbol.trim().toUpperCase();
    if (!sym) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.get(`${API_URL}/api/stocks/price/${sym}`, { headers: getAuthHeader() });
      setResult({ symbol: sym, price: res.data.price });
    } catch {
      setError('Symbol not found or price unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const inWatchlist = result && watchlist.includes(result.symbol);

  return (
    <div>
      <div className="section-header" style={{ background: 'rgba(79,70,229,0.08)', color: '#4f46e5', borderBottom: '1px solid rgba(79,70,229,0.12)', padding: '16px 22px', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Stock Lookup
      </div>
      <div className="section-body">
        <form onSubmit={handleSearch} className="stock-search-form">
          <input
            type="text"
            placeholder="Ticker symbol (e.g. AAPL)"
            value={symbol}
            onChange={e => setSymbol(e.target.value.toUpperCase())}
            className="stock-search-input"
          />
          <button type="submit" className="stock-search-btn" disabled={loading}>
            {loading ? '…' : 'Look up'}
          </button>
        </form>
        {error && <p className="search-error">{error}</p>}
        {result && (
          <div className="search-result-card">
            <div className="search-result-left">
              <span className="search-result-symbol">{result.symbol}</span>
              <span className="search-result-label">Current Price</span>
            </div>
            <div className="search-result-right">
              <span className="search-result-price">${result.price.toFixed(2)}</span>
              {onAddToWatchlist && (
                <button
                  className={`watchlist-toggle-btn ${inWatchlist ? 'watching' : ''}`}
                  onClick={() => !inWatchlist && onAddToWatchlist(result.symbol)}
                  disabled={inWatchlist}
                >
                  {inWatchlist ? '★ Watching' : '☆ Watch'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSearch;
