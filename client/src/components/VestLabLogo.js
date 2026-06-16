import React from 'react';

const VestLabLogo = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hexagon background */}
    <path
      d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
      fill="url(#hexGrad)"
      opacity="0.9"
    />
    {/* Chart line — dips then rises sharply */}
    <polyline
      points="9,26 15,20 20,24 28,12"
      stroke="white"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.95"
    />
    {/* Rising arrow tip */}
    <polyline
      points="24,11 28,12 27,16"
      stroke="white"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.95"
    />
    <defs>
      <linearGradient id="hexGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
  </svg>
);

export default VestLabLogo;
