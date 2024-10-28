import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = ({ userId, balance }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/${userId}/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, [userId]);

  useEffect(() => {
    const fetchLivePrices = async () => {
      const updatedLivePrices = {};
      const pricePromises = portfolio.map(async (stock) => {
        const symbol = stock.symbol;
        if (symbol) {
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
        }
      });
      await Promise.all(pricePromises);
      setLivePrices(updatedLivePrices);
    };

    if (portfolio.length > 0) {
      fetchLivePrices();
    }
  }, [portfolio]);

  return (
    <div>
      <h2>Your Portfolio</h2>
      <h3>Current Balance: ${balance.toFixed(2)}</h3>
      {portfolio.length === 0 ? (
        <p>No shares in your portfolio.</p>
      ) : (
        portfolio.map(stock => (
          <div key={stock.symbol}>
            <p>
              {stock.symbol}: {stock.shares} shares at ${stock.avgPrice ? stock.avgPrice.toFixed(2) : 'N/A'} each
              <br />
              Live Price: ${livePrices[stock.symbol] ? livePrices[stock.symbol].toFixed(2) : 'Fetching...'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Portfolio;