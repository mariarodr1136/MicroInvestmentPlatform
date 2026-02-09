import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const STOCKS = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN'];
const API_KEY = process.env.REACT_APP_STOCK_API_KEY;

const StockChart = () => {
  const [selected, setSelected] = useState('AAPL');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      if (cache.current[selected]) {
        setChartData(cache.current[selected]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${selected}&apikey=${API_KEY}`
        );

        const timeSeries = res.data['Time Series (Daily)'];
        if (!timeSeries) {
          setError('Rate limit reached. Try again in a minute.');
          setLoading(false);
          return;
        }

        const entries = Object.entries(timeSeries).slice(0, 30).reverse();
        const labels = entries.map(([date]) => {
          const d = new Date(date);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        });
        const prices = entries.map(([, values]) => parseFloat(values['4. close']));

        const data = { labels, prices };
        cache.current[selected] = data;
        setChartData(data);
      } catch {
        setError('Failed to fetch stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selected]);

  const config = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.prices,
            borderColor: '#1a1a1a',
            backgroundColor: 'rgba(26, 26, 26, 0.05)',
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            tension: 0.3,
            fill: true,
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: {
          font: { size: 11 },
          callback: (val) => `$${val}`,
        },
      },
    },
  };

  return (
    <div>
      <div className="section-header blue">Stock Trends</div>
      <div className="section-body">
        <div className="chart-stock-buttons">
          {STOCKS.map((symbol) => (
            <button
              key={symbol}
              className={`chart-stock-btn${selected === symbol ? ' active' : ''}`}
              onClick={() => setSelected(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
        <div className="chart-container">
          {loading && <div className="chart-loading">Loading...</div>}
          {error && <div className="form-error">{error}</div>}
          {config && !loading && (
            <Line data={config} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChart;
