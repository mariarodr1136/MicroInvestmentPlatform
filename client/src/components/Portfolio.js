import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Portfolio = ({ userId, balance }) => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${userId}/portfolio`); 
        setPortfolio(response.data); 
      } catch (error) {
        console.error("Error fetching portfolio:", error); 
      }
    };

    fetchPortfolio(); // Fetch portfolio on component mount
  }, [userId]);

  return (
    <div>
      <h2>Your Portfolio</h2>
      <h3>Current Balance: ${balance.toFixed(2)}</h3> {/* Limit to 2 decimal points */}
      {portfolio.length === 0 ? ( // Check if portfolio is empty
        <p>No shares in your portfolio.</p>
      ) : (
        portfolio.map(stock => (
          <div key={stock.symbol}>
            <p>{stock.symbol}: {stock.shares} shares at ${stock.avgPrice ? stock.avgPrice.toFixed(2) : 'N/A'} each</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Portfolio;
