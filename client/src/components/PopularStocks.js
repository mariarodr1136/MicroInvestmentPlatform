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
    DIS: 'https://finance.yahoo.com/quote/DIS/',      
  }), []);

  return (
    <div className="popular-stocks">
      <h3 className="text-xl font-semibold mb-4 underline">Popular Stocks</h3>
      <div className="flex flex-wrap"> 
        {Object.entries(stockData).map(([symbol, link]) => (
          <div key={symbol} className="stock-item mr-4 mb-2"> 
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
    </div>
  );
};

export default PopularStocks;
