import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import Tooltip from './Tooltip';

const ACHIEVEMENTS = [
  { id: 'first_trade',   icon: '🎯', name: 'First Trade',      desc: 'Made your first trade' },
  { id: 'sell_once',     icon: '🚪', name: 'Cash Out',         desc: 'Sold shares at least once' },
  { id: 'profitable',    icon: '💰', name: 'In the Green',     desc: 'Closed a sell with positive P&L' },
  { id: 'big_spender',   icon: '💎', name: 'Big Spender',      desc: 'Total invested over $5,000' },
  { id: 'diversified',   icon: '🌐', name: 'Diversified',      desc: 'Hold 5 or more different stocks' },
  { id: 'active_trader', icon: '⚡', name: 'Active Trader',    desc: '10 or more trades placed' },
  { id: 'explorer',      icon: '🔭', name: 'Stock Explorer',   desc: 'Traded 10 different symbols' },
  { id: 'veteran',       icon: '🏆', name: 'Veteran',          desc: '25 or more trades placed' },
];

const check = (id, txns, portfolio) => {
  switch (id) {
    case 'first_trade':   return txns.length >= 1;
    case 'sell_once':     return txns.some(t => t.type === 'sell');
    case 'profitable':    return txns.some(t => t.type === 'sell' && t.buyPricePerShare != null && t.pricePerShare > t.buyPricePerShare);
    case 'big_spender':   return txns.filter(t => t.type === 'buy').reduce((s, t) => s + t.pricePerShare * t.shares, 0) >= 5000;
    case 'diversified':   return portfolio.length >= 5;
    case 'active_trader': return txns.length >= 10;
    case 'explorer':      return new Set(txns.map(t => t.symbol)).size >= 10;
    case 'veteran':       return txns.length >= 25;
    default: return false;
  }
};

const Achievements = ({ userId }) => {
  const [unlocked, setUnlocked] = useState([]);
  const [locked, setLocked] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      try {
        const [txRes, portRes] = await Promise.all([
          axios.get(`${API_URL}/api/transactions/${userId}/history`, { params: { limit: 100 }, headers: getAuthHeader() }),
          axios.get(`${API_URL}/api/user/${userId}/portfolio`, { headers: getAuthHeader() }),
        ]);
        const txns = txRes.data;
        const portfolio = portRes.data;
        setUnlocked(ACHIEVEMENTS.filter(a => check(a.id, txns, portfolio)));
        setLocked(ACHIEVEMENTS.filter(a => !check(a.id, txns, portfolio)));
      } catch {}
    };
    fetch();
  }, [userId]);

  return (
    <div>
      <div className="section-header teal">Achievements</div>
      <div className="section-body">
        <div className="achievements-grid">
          {unlocked.map(a => (
            <Tooltip key={a.id} text={a.desc}>
              <div className="achievement-badge unlocked">
                <span className="achievement-icon">{a.icon}</span>
                <span className="achievement-name">{a.name}</span>
              </div>
            </Tooltip>
          ))}
          {locked.map(a => (
            <Tooltip key={a.id} text={a.desc}>
              <div className="achievement-badge locked">
                <span className="achievement-icon">🔒</span>
                <span className="achievement-name">{a.name}</span>
              </div>
            </Tooltip>
          ))}
        </div>
        <p className="achievement-count">{unlocked.length} / {ACHIEVEMENTS.length} unlocked</p>
      </div>
    </div>
  );
};

export default Achievements;
