import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const PopularStocks = () => {
  const [livePrices, setLivePrices] = useState({});

  // Memoize popular stock symbols
  const stockSymbols = useMemo(() => ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT'], []);

  // Fetch live prices for popular stocks
  useEffect(() => {
    const fetchLivePrices = async () => {
      const updatedLivePrices = {};
      const pricePromises = stockSymbols.map(async (symbol) => {
        try {
          const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
              function: 'TIME_SERIES_INTRADAY',
              symbol: symbol,
              interval: '5min',
              apikey: process.env.REACT_APP_STOCK_API_KEY,
            },
          });

          const timeSeries = response.data['Time Series (5min)'];

          if (timeSeries) {
            const latestTime = Object.keys(timeSeries)[0];
            const latestData = timeSeries[latestTime];
            updatedLivePrices[symbol] = parseFloat(latestData['4. close']);
          } else {
            console.error('No time series data returned for:', symbol);
          }
        } catch (error) {
          console.error(`Error fetching live stock price for ${symbol}:`, error);
        }
      });

      await Promise.all(pricePromises);
      setLivePrices(updatedLivePrices);
    };

    fetchLivePrices(); // Call function to fetch prices
  }, [stockSymbols]); // stockSymbols is now memoized

  return (
    <div className="popular-stocks">
      <h2>Most Popular Stocks</h2>
      {stockSymbols.map((symbol) => (
        <div key={symbol} className="stock-item">
          <span>{symbol}: </span>
          <strong>
            ${livePrices[symbol] ? livePrices[symbol].toFixed(2) : 'Fetching...'}
          </strong>
        </div>
      ))}
    </div>
  );
};

export default PopularStocks;
