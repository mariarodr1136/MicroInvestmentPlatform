import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const PortfolioPerformance = ({ userId, balance }) => {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const build = async () => {
      try {
        const [txRes, portRes] = await Promise.all([
          axios.get(`${API_URL}/api/transactions/${userId}/history`, { params: { limit: 100 }, headers: getAuthHeader() }),
          axios.get(`${API_URL}/api/user/${userId}/portfolio`, { headers: getAuthHeader() }),
        ]);

        const txns = txRes.data.slice().reverse(); // oldest first
        const portfolio = portRes.data;

        if (txns.length === 0) { setPoints([]); return; }

        // Fetch current prices for all held symbols
        const symbols = [...new Set([...txns.map(t => t.symbol), ...portfolio.map(p => p.symbol)])];
        const priceEntries = await Promise.all(
          symbols.map(sym =>
            axios.get(`${API_URL}/api/stocks/price/${sym}`, { headers: getAuthHeader() })
              .then(r => [sym, r.data.price])
              .catch(() => [sym, null])
          )
        );
        const prices = Object.fromEntries(priceEntries);

        // Reconstruct portfolio state at each transaction
        let holdings = {};
        let cash = 10000;
        const pts = [{ label: 'Start', value: cash }];

        txns.forEach(t => {
          const cost = t.pricePerShare * t.shares;
          if (t.type === 'buy') {
            cash -= cost;
            holdings[t.symbol] = (holdings[t.symbol] || 0) + t.shares;
          } else {
            cash += cost;
            holdings[t.symbol] = Math.max(0, (holdings[t.symbol] || 0) - t.shares);
          }
          const holdingsValue = Object.entries(holdings).reduce((sum, [sym, qty]) => {
            return sum + qty * (prices[sym] ?? t.pricePerShare);
          }, 0);
          pts.push({
            label: new Date(t.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
            value: parseFloat((cash + holdingsValue).toFixed(2)),
          });
        });

        // Current value
        const currentHoldings = portfolio.reduce((sum, s) => sum + s.shares * (prices[s.symbol] ?? s.avgPrice), 0);
        pts.push({ label: 'Now', value: parseFloat((balance + currentHoldings).toFixed(2)) });

        setPoints(pts);
      } catch (e) {
        console.error(e);
      }
    };
    build();
  }, [userId, balance]);

  if (!points || points.length < 2) return null;

  const start = points[0].value;
  const end = points[points.length - 1].value;
  const isUp = end >= start;
  const lineColor = isUp ? '#22c55e' : '#f43f5e';
  const totalReturn = end - start;
  const returnPct = ((end - start) / start) * 100;

  const config = {
    labels: points.map(p => p.label),
    datasets: [{
      data: points.map(p => p.value),
      borderColor: lineColor,
      backgroundColor: isUp ? 'rgba(34,197,94,0.1)' : 'rgba(244,63,94,0.1)',
      borderWidth: 2,
      pointRadius: points.length > 10 ? 0 : 3,
      pointHitRadius: 10,
      tension: 0.35,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `$${ctx.parsed.y.toFixed(2)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, maxTicksLimit: 8 } },
      y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, callback: val => `$${val.toLocaleString()}` } },
    },
  };

  return (
    <div>
      <div className="section-header blue">Portfolio Performance</div>
      <div className="section-body">
        <div className="perf-summary">
          <div className="perf-stat">
            <span className="perf-label">Current Value</span>
            <span className="perf-value">${end.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="perf-stat">
            <span className="perf-label">Total Return</span>
            <span className={`perf-value ${isUp ? 'perf-up' : 'perf-down'}`}>
              {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}&nbsp;
              ({returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="chart-container">
          <Line data={config} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
