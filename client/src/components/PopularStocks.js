import React, { useMemo } from 'react';

const PopularStocks = () => {
  // Popular stock symbols and their links
  const stockData = useMemo(() => ({
    AAPL: 'https://finance.yahoo.com/quote/AAPL/', 
    TSLA: 'https://finance.yahoo.com/quote/TSLA/',
    AMZN: 'https://finance.yahoo.com/quote/AMZN/', 
    GOOGL: 'https://finance.yahoo.com/quote/GOOGL/', 
    MSFT: 'https://finance.yahoo.com/quote/MSFT/',
    META: 'https://finance.yahoo.com/quote/META/',        
    NFLX: 'https://finance.yahoo.com/quote/NFLX/',     
    NVDA: 'https://finance.yahoo.com/quote/NVDA/',    
    BABA: 'https://finance.yahoo.com/quote/BABA/',
  }), []);

  return (
    <div>
      <div className="section-header teal">Popular Stocks</div>
      <div className="section-body">
        <div className="popular-stocks-grid">
          {Object.entries(stockData).map(([symbol, link]) => (
            <a
              key={symbol}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="stock-chip"
            >
              {symbol}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularStocks;
