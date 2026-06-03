import React, { useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';

const HORIZONS = [
  { label: '1W',  key: '1w', mockReturn: () => (Math.random() - 0.42) * 5   },
  { label: '1M',  key: '1m', mockReturn: () => (Math.random() - 0.40) * 10  },
  { label: '3M',  key: '3m', mockReturn: () => (Math.random() - 0.37) * 18  },
  { label: '6M',  key: '6m', mockReturn: () => (Math.random() - 0.35) * 28  },
  { label: '1Y',  key: '1y', mockReturn: () => (Math.random() - 0.32) * 45  },
];

const HORIZON_LABELS = { '1w': '1 week', '1m': '1 month', '3m': '3 months', '6m': '6 months', '1y': '1 year' };

const WhatIfSimulator = () => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [horizon, setHorizon] = useState('1m');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulate = async (e) => {
    e.preventDefault();
    const sym = symbol.trim().toUpperCase();
    const qty = parseFloat(shares);
    if (!sym || !qty || qty <= 0) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.get(`${API_URL}/api/stocks/price/${sym}`, { headers: getAuthHeader() });
      const price = res.data.price;
      const h = HORIZONS.find(h => h.key === horizon);
      const returnPct = h.mockReturn();
      const cost = price * qty;
      const projectedValue = cost * (1 + returnPct / 100);
      const gain = projectedValue - cost;
      setResult({ symbol: sym, price, shares: qty, cost, projectedValue, returnPct, gain, horizonLabel: HORIZON_LABELS[horizon] });
    } catch {
      setError('Could not find price for that symbol.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header amber">What-If Simulator</div>
      <div className="section-body">
        <p className="sim-description">See a hypothetical return without placing a real trade.</p>
        <form onSubmit={handleSimulate} className="trade-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Stock symbol (e.g. TSLA)"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              placeholder="Number of shares"
              value={shares}
              min="0.01"
              step="any"
              onChange={e => setShares(e.target.value)}
            />
            <select
              className="horizon-select"
              value={horizon}
              onChange={e => setHorizon(e.target.value)}
            >
              {HORIZONS.map(h => (
                <option key={h.key} value={h.key}>{HORIZON_LABELS[h.key]}</option>
              ))}
            </select>
            <button type="submit" className="simulate-btn" disabled={loading}>
              {loading ? 'Calculating…' : 'Simulate'}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
        {result && (
          <div className="simulation-result">
            <div className="sim-row">
              <span className="sim-label">Cost today</span>
              <span className="sim-val">${result.cost.toFixed(2)}</span>
            </div>
            <div className="sim-row">
              <span className="sim-label">After {result.horizonLabel}</span>
              <span className={`sim-val ${result.projectedValue >= result.cost ? 'sim-up' : 'sim-down'}`}>
                ${result.projectedValue.toFixed(2)}
              </span>
            </div>
            <div className="sim-row sim-row-total">
              <span className="sim-label">Projected gain/loss</span>
              <span className={`sim-val ${result.gain >= 0 ? 'sim-up' : 'sim-down'}`}>
                {result.gain >= 0 ? '+' : ''}${result.gain.toFixed(2)} ({result.returnPct >= 0 ? '+' : ''}{result.returnPct.toFixed(2)}%)
              </span>
            </div>
            <p className="sim-disclaimer">Uses simulated returns for educational purposes only.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
