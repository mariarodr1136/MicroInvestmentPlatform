// WelcomeBanner.js
import React from 'react';

const WelcomeBanner = ({ username, balance, isLoading, error }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Micro-Investment Education Platform
      </h1>
      
      {isLoading ? (
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
      ) : error ? (
        <p className="text-sm text-red-500">
          Unable to load user information
        </p>
      ) : username ? (
        <>
          <p className="text-lg bold-text mb-1">
            Welcome, {username}!
          </p>
          <p className="text-lg bold-text">
            Your Balance: ${balance.toFixed(2)}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Welcome, Guest!
        </p>
      )}
    </div>
  );
};

export default WelcomeBanner;
