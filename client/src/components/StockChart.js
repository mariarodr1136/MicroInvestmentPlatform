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

// Generate mock stock data for when API limit is reached
const generateMockData = (symbol) => {
  const basePrices = {
    'AAPL': 178.50,
    'GOOGL': 141.25,
    'TSLA': 245.00,
    'MSFT': 375.00,
    'AMZN': 150.25
  };

  const basePrice = basePrices[symbol] || 100;
  const labels = [];
  const prices = [];
  const today = new Date();

  // Generate 30 days of mock data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(`${date.getMonth() + 1}/${date.getDate()}`);

    // Generate realistic price with small random variations
    const variation = (Math.random() - 0.5) * (basePrice * 0.05); // +/- 5% variation
    const price = basePrice + variation + (Math.sin(i / 3) * basePrice * 0.02);
    prices.push(parseFloat(price.toFixed(2)));
  }

  return { labels, prices };
};

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

        // Check for rate limit or errors, fallback to mock data
        if (!timeSeries || res.data['Note'] || res.data['Information']) {
          console.log('API limit reached for stock chart, using mock data');
          const mockData = generateMockData(selected);
          cache.current[selected] = mockData;
          setChartData(mockData);
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
      } catch (err) {
        console.log('Error fetching stock chart data, using mock data:', err.message);
        const mockData = generateMockData(selected);
        cache.current[selected] = mockData;
        setChartData(mockData);
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
