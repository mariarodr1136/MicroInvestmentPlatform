import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import Tooltip from './Tooltip';

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const compute = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/transactions/${userId}/history`, {
          params: { limit: 100 },
          headers: getAuthHeader(),
        });
        const txns = res.data;
        const buys = txns.filter(t => t.type === 'buy');
        const sells = txns.filter(t => t.type === 'sell');
        const sellsWithPnl = sells.filter(t => t.buyPricePerShare != null);
        const profitable = sellsWithPnl.filter(t => t.pricePerShare > t.buyPricePerShare).length;
        const winRate = sellsWithPnl.length > 0 ? (profitable / sellsWithPnl.length) * 100 : null;

        const pnlBySymbol = {};
        sellsWithPnl.forEach(t => {
          const pnl = (t.pricePerShare - t.buyPricePerShare) * t.shares;
          pnlBySymbol[t.symbol] = (pnlBySymbol[t.symbol] || 0) + pnl;
        });
        const entries = Object.entries(pnlBySymbol);
        const best  = entries.length ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : null;
        const worst = entries.length ? entries.reduce((a, b) => a[1] < b[1] ? a : b) : null;
        const totalRealized = entries.reduce((s, [, v]) => s + v, 0);
        const uniqueStocks = new Set(txns.map(t => t.symbol)).size;
        const totalInvested = buys.reduce((s, t) => s + t.pricePerShare * t.shares, 0);

        setStats({ total: txns.length, buys: buys.length, sells: sells.length, winRate, best, worst, totalRealized, uniqueStocks, totalInvested });
      } catch {}
    };
    compute();
  }, [userId]);

  if (!stats) return null;

  const { best, worst } = stats;
  const rows = [
    { label: 'Total Trades',    tip: 'All buy and sell transactions combined',              val: stats.total, cls: '' },
    { label: 'Buys / Sells',    tip: 'Number of buy trades vs sell trades',                 val: `${stats.buys} / ${stats.sells}`, cls: '' },
    { label: 'Win Rate',        tip: 'Percentage of sells that closed at a profit',         val: stats.winRate != null ? `${stats.winRate.toFixed(0)}%` : '—', cls: stats.winRate >= 50 ? 'stat-up' : stats.winRate != null ? 'stat-down' : '' },
    { label: 'Unique Stocks',   tip: 'Number of different ticker symbols traded',           val: stats.uniqueStocks, cls: '' },
    { label: 'Total Invested',  tip: 'Total capital spent on buy orders',                   val: `$${stats.totalInvested.toFixed(2)}`, cls: '' },
    { label: 'Realized P&L',   tip: 'Profit or loss from completed sell trades',           val: `${stats.totalRealized >= 0 ? '+' : ''}$${stats.totalRealized.toFixed(2)}`, cls: stats.totalRealized >= 0 ? 'stat-up' : 'stat-down' },
    ...(best  ? [{ label: 'Best Stock',  tip: 'Stock with highest realized profit',  val: `${best[0]}  +$${best[1].toFixed(2)}`,  cls: 'stat-up'   }] : []),
    ...(worst && worst[0] !== best?.[0] ? [{ label: 'Worst Stock', tip: 'Stock with largest realized loss', val: `${worst[0]}  $${worst[1].toFixed(2)}`, cls: 'stat-down' }] : []),
  ];

  return (
    <div>
      <div className="section-header purple">Your Stats</div>
      <div className="section-body">
        <div className="stats-grid">
          {rows.map(r => (
            <div key={r.label} className="stat-card">
              <span className="stat-label">
                <Tooltip text={r.tip}>{r.label} <span className="stat-tip-icon">?</span></Tooltip>
              </span>
              <span className={`stat-value ${r.cls}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
