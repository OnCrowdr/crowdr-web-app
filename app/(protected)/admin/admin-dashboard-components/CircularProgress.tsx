import { RFC } from "@/types"

import React from 'react';

const CircularProgress: RFC<CircularProgressProps> = ({ percent }) => {
  const radius = 25;
  const stroke = 5.25;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (Number(percent) / 100 * circumference);

  return (
    <div style={{ position: 'relative', width: '56px', height: '56px' }}>
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={normalizedRadius}
          fill="none"
          stroke="#EAECF0"
          strokeWidth={stroke}
        />
        <circle
          cx="28"
          cy="28"
          r={normalizedRadius}
          fill="none"
          stroke="#7F56D9"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 28 28)`}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '12.25px',
        fontWeight: '600',
      }}>
        {percent}%
      </div>
    </div>
  );
};

export default CircularProgress;

interface CircularProgressProps {
  percent: number | string
}