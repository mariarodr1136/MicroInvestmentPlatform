import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#6366f1','#059669','#dc2626','#d97706','#2563eb','#7c3aed','#0891b2','#f59e0b','#10b981','#ef4444','#f97316','#8b5cf6'];

const PortfolioAllocation = ({ portfolio, currentPrices }) => {
  if (!portfolio || portfolio.length === 0) return null;

  const data = portfolio.map((s, i) => ({
    symbol: s.symbol,
    value: s.shares * (currentPrices[s.symbol] ?? s.avgPrice),
    color: COLORS[i % COLORS.length],
  }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total <= 0) return null;

  const chartData = {
    labels: data.map(d => d.symbol),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: data.map(d => d.color),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` $${ctx.parsed.toFixed(2)} (${((ctx.parsed / total) * 100).toFixed(1)}%)`,
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="allocation-wrapper">
      <div className="allocation-chart">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="allocation-legend">
        {data.map(d => (
          <div key={d.symbol} className="allocation-legend-row">
            <span className="allocation-dot" style={{ background: d.color }} />
            <span className="allocation-sym">{d.symbol}</span>
            <span className="allocation-pct">{((d.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAllocation;
