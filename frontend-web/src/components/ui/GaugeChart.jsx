import React from 'react';

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
const GaugeChart = ({ value, min = 0, max = 100, label }) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // Color logic
  const color = value >= 4.2 ? 'stroke-indigo-500' : 'stroke-red-500';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="stroke-white/10 fill-none"
            strokeWidth="8"
            cx="50"
            cy="50"
            r="40"
          />
          <circle
            className={`${color} fill-none transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            className="fill-white text-3xl font-bold"
          >
            {value}
          </text>
        </svg>
      </div>
      {label && <span className="text-sm text-slate-400 mt-2">{label}</span>}
    </div>
  );
};

export default GaugeChart;
