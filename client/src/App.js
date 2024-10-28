import React from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import './App.css'; 

const App = () => {
  const userId = '671e97b055d22be8e9600518'; 

  return (
    <div className="App">
      <div className="container">
        <h1>Micro-Investment Education Platform</h1>
        <Portfolio userId={userId} />
        <Leaderboard />
      </div>
    </div>
  );
};

export default App;
