import React, { useState, useEffect, useRef } from 'react';

const BASE = [
  { name: 'S&P 500',      symbol: 'SPX',  price: 5280.42, change: 0.62  },
  { name: 'NASDAQ',       symbol: 'COMP', price: 16742.39, change: 0.84 },
  { name: 'DOW',          symbol: 'DJI',  price: 39069.11, change: 0.31 },
  { name: 'Russell 2000', symbol: 'RUT',  price: 2048.59,  change: -0.22 },
  { name: 'VIX',          symbol: 'VIX',  price: 13.24,    change: -1.14 },
];

const MarketIndices = () => {
  const [indices, setIndices] = useState(BASE);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const delta = (Math.random() - 0.48) * 0.06;
        const newPrice = parseFloat((idx.price * (1 + delta / 100)).toFixed(2));
        const newChange = parseFloat((idx.change + (Math.random() - 0.48) * 0.04).toFixed(2));
        return { ...idx, price: newPrice, change: newChange };
      }));
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="market-indices-bar">
      {indices.map(idx => (
        <div key={idx.symbol} className="market-index-item">
          <span className="index-name">{idx.name}</span>
          <span className="index-price">
            {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`index-change ${idx.change >= 0 ? 'index-up' : 'index-down'}`}>
            {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default MarketIndices;
