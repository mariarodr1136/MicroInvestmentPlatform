import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';

const Watchlist = ({ userId, externalAdd }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/${userId}/watchlist`, { headers: getAuthHeader() });
      setWatchlist(res.data.watchlist || []);
    } catch {}
  };

  useEffect(() => { fetchWatchlist(); }, [userId]);

  // Allow parent (StockSearch) to add a symbol
  useEffect(() => {
    if (!externalAdd) return;
    addSymbol(externalAdd);
  }, [externalAdd]);

  useEffect(() => {
    if (watchlist.length === 0) { setPrices({}); return; }
    const fetchPrices = async () => {
      const entries = await Promise.all(
        watchlist.map(sym =>
          axios.get(`${API_URL}/api/stocks/price/${sym}`, { headers: getAuthHeader() })
            .then(r => [sym, r.data.price])
            .catch(() => [sym, null])
        )
      );
      setPrices(Object.fromEntries(entries));
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const addSymbol = async (sym) => {
    const s = sym.trim().toUpperCase();
    if (!s || watchlist.includes(s)) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/user/${userId}/watchlist`, { symbol: s }, { headers: getAuthHeader() });
      setWatchlist(prev => [...prev, s]);
      setInput('');
    } catch {}
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addSymbol(input);
  };

  const remove = async (sym) => {
    try {
      await axios.delete(`${API_URL}/api/user/${userId}/watchlist/${sym}`, { headers: getAuthHeader() });
      setWatchlist(prev => prev.filter(s => s !== sym));
    } catch {}
  };

  return (
    <div>
      <div className="section-header green">Watchlist</div>
      <div className="section-body">
        <form onSubmit={handleSubmit} className="watchlist-form">
          <input
            type="text"
            placeholder="Add ticker (e.g. NVDA)"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            className="watchlist-input"
          />
          <button type="submit" className="watchlist-add-btn" disabled={loading}>Add</button>
        </form>
        {watchlist.length === 0 ? (
          <p className="watchlist-empty">No stocks added yet. Search a ticker above or type one here.</p>
        ) : (
          <ul className="watchlist-list">
            {watchlist.map(sym => (
              <li key={sym} className="watchlist-item">
                <span className="watchlist-symbol">{sym}</span>
                <span className="watchlist-price">
                  {prices[sym] != null ? `$${prices[sym].toFixed(2)}` : '—'}
                </span>
                <button className="watchlist-remove" onClick={() => remove(sym)} title="Remove">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
