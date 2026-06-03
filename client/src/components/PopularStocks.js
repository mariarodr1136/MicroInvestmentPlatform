import React, { useMemo } from 'react';

const PopularStocks = () => {
  // Popular stock symbols and their links
  const stockData = useMemo(() => ({
    AAPL:  'https://finance.yahoo.com/quote/AAPL/',
    TSLA:  'https://finance.yahoo.com/quote/TSLA/',
    NVDA:  'https://finance.yahoo.com/quote/NVDA/',
    MSFT:  'https://finance.yahoo.com/quote/MSFT/',
    AMZN:  'https://finance.yahoo.com/quote/AMZN/',
    GOOGL: 'https://finance.yahoo.com/quote/GOOGL/',
    META:  'https://finance.yahoo.com/quote/META/',
    AMD:   'https://finance.yahoo.com/quote/AMD/',
    NFLX:  'https://finance.yahoo.com/quote/NFLX/',
    V:     'https://finance.yahoo.com/quote/V/',
    JPM:   'https://finance.yahoo.com/quote/JPM/',
    DIS:   'https://finance.yahoo.com/quote/DIS/',
    UBER:  'https://finance.yahoo.com/quote/UBER/',
    PYPL:  'https://finance.yahoo.com/quote/PYPL/',
    INTC:  'https://finance.yahoo.com/quote/INTC/',
    CRM:   'https://finance.yahoo.com/quote/CRM/',
    SPOT:  'https://finance.yahoo.com/quote/SPOT/',
    BABA:  'https://finance.yahoo.com/quote/BABA/',
    WMT:   'https://finance.yahoo.com/quote/WMT/',
    PLTR:  'https://finance.yahoo.com/quote/PLTR/',
    COIN:  'https://finance.yahoo.com/quote/COIN/',
    SHOP:  'https://finance.yahoo.com/quote/SHOP/',
    SQ:    'https://finance.yahoo.com/quote/SQ/',
    ABNB:  'https://finance.yahoo.com/quote/ABNB/',
    RIVN:  'https://finance.yahoo.com/quote/RIVN/',
    NIO:   'https://finance.yahoo.com/quote/NIO/',
    F:     'https://finance.yahoo.com/quote/F/',
    BA:    'https://finance.yahoo.com/quote/BA/',
    XOM:   'https://finance.yahoo.com/quote/XOM/',
    PFE:   'https://finance.yahoo.com/quote/PFE/',
    SNAP:  'https://finance.yahoo.com/quote/SNAP/',
    PINS:  'https://finance.yahoo.com/quote/PINS/',
    ROKU:  'https://finance.yahoo.com/quote/ROKU/',
    ZM:    'https://finance.yahoo.com/quote/ZM/',
    GME:   'https://finance.yahoo.com/quote/GME/',
    AMC:   'https://finance.yahoo.com/quote/AMC/',
  }), []);

  return (
    <div className="popular-stocks-wrapper">
      <div className="section-header teal">Popular Stocks</div>
      <div className="section-body popular-stocks-body">
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
