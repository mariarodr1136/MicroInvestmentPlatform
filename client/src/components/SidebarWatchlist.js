import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';

const SidebarWatchlist = ({ userId, externalAdd }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/api/user/${userId}/watchlist`, { headers: getAuthHeader() })
      .then(r => setWatchlist(r.data.watchlist || []))
      .catch(() => {});
  }, [userId]);

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
      setPrices(prev => { const n = { ...prev }; delete n[sym]; return n; });
    } catch {}
  };

  return (
    <div className="sidebar-watchlist">
      <div className="sidebar-section-label">Watchlist</div>
      <form onSubmit={handleSubmit} className="sidebar-watchlist-form">
        <input
          type="text"
          placeholder="Add ticker…"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          className="sidebar-watchlist-input"
        />
        <button type="submit" className="sidebar-watchlist-add-btn" disabled={loading || !input}>+</button>
      </form>
      {watchlist.length === 0 ? (
        <p className="sidebar-watchlist-empty">No stocks yet.</p>
      ) : (
        <ul className="sidebar-watchlist-list">
          {watchlist.map(sym => (
            <li key={sym} className="sidebar-watchlist-item">
              <span className="sidebar-watchlist-symbol">{sym}</span>
              <span className="sidebar-watchlist-price">
                {prices[sym] != null ? `$${prices[sym].toFixed(2)}` : '—'}
              </span>
              <button className="sidebar-watchlist-remove" onClick={() => remove(sym)} title="Remove">✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarWatchlist;
