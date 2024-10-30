import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = ({ userId, balance }) => {
  const [portfolio, setPortfolio] = useState([]);

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

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 underline">Your Portfolio</h3>
      {portfolio.length === 0 ? (
        <p>No shares in your portfolio.</p>
      ) : (
        portfolio.map(stock => (
          <div key={stock.symbol}>
            <p>
              {stock.symbol}: {stock.shares} shares at ${stock.avgPrice ? stock.avgPrice.toFixed(2) : 'N/A'} each
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Portfolio;
