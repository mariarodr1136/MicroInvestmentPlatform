import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = ({ userId }) => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };
    fetchPortfolio();
  }, [userId]);  

  return (
    <div>
      <h2>Your Portfolio</h2>
      {portfolio.map(stock => (
        <div key={stock.symbol}>
          <p>{stock.symbol}: {stock.shares} shares at ${stock.avgPrice.toFixed(2)} each</p>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
