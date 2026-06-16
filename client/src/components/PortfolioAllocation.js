import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#818cf8','#22c55e','#f43f5e','#fbbf24','#38bdf8','#a78bfa','#2dd4bf','#fb923c','#34d399','#fb7185','#4ade80','#c084fc'];

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
      borderColor: '#0f1220',
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
