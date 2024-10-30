import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);  

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 underline">Leaderboard</h3>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {leaders.map((user, index) => (
          <li key={user._id}>
            {index + 1}. {user.username}: ${user.balance.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
