import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/leaderboard`);
        setLeaders(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);  

  const rankClass = (index) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return 'default';
  };

  return (
    <div>
      <div className="section-header amber">Leaderboard</div>
      <div className="section-body">
        <ul className="leaderboard-list">
          {leaders.map((user, index) => (
            <li key={user._id} className="leaderboard-item">
              <span className={`leaderboard-rank ${rankClass(index)}`}>{index + 1}</span>
              <span className="leaderboard-name">{user.username}</span>
              <span className="leaderboard-balance">${user.balance.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
