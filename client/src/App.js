import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const userId = '671e97b055d22be8e9600518'; 
  const [balance, setBalance] = useState(0); // Initialize balance state

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${userId}/balance`); // Updated API URL
        console.log("Balance response:", response.data); // Log the response
        if (response.data && response.data.balance !== undefined) {
          setBalance(response.data.balance); // Update balance state
        } else {
          console.error("Balance data is not available in the response.");
        }
      } catch (error) {
        console.error("Error fetching balance:", error.response ? error.response.data : error.message); // Log error
      }
    };

    fetchBalance(); // Fetch balance on component mount
  }, [userId]);

  return (
    <div className="App">
      <div className="container">
        <h1>Micro-Investment Education Platform</h1>
        <Portfolio userId={userId} balance={balance} /> {/* Pass balance to Portfolio */}
        <Leaderboard />
      </div>
    </div>
  );
};

export default App;
