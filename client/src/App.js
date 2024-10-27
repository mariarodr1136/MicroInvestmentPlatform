import React from 'react';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';

const App = () => {
  // Replace 'USER_ID' with a valid user ID from your database or use state management to manage user authentication.
  const userId = '671e97b055d22be8e9600518'; 

  return (
    <div className="App">
      <h1>Micro-Investment Education Platform</h1>
      <Portfolio userId={userId} />
      <Leaderboard />
    </div>
  );
};

export default App;
