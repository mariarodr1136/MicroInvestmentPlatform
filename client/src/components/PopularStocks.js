import React, { useMemo } from 'react';

const PopularStocks = () => {
  //Popular stock symbols and their links
  const stockData = useMemo(() => ({
    AAPL: 'https://finance.yahoo.com/quote/TTWO/', 
    TSLA: 'https://finance.yahoo.com/quote/TSLA/',
    AMZN: 'https://finance.yahoo.com/quote/AMZN/', 
    GOOGL: 'https://finance.yahoo.com/quote/GOOGL/', 
    MSFT: 'https://finance.yahoo.com/quote/MSFT/',
  }), []);

  return (
    <div className="popular-stocks">
      <h3 className="text-xl font-semibold mb-4 underline">Popular Stocks</h3>
      {Object.entries(stockData).map(([symbol, link]) => (
        <div key={symbol} className="stock-item">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="stock-link"
          >
            {symbol}
          </a>
        </div>
      ))}
    </div>
  );
};

export default PopularStocks;
