import React from 'react';

interface PlayerAvatarProps {
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  squadNumber: number | null;
  className?: string;
  size?: number;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  position,
  squadNumber,
  className = '',
  size = 64
}) => {
  // Generate some stable colors based on player name
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Choose jersey color based on position
  let jerseyColor = '#4f46e5'; // Indigo
  let stripeColor = '#818cf8';
  let textColor = '#ffffff';

  if (position === 'Goalkeeper') {
    jerseyColor = '#eab308'; // Amber/Yellow
    stripeColor = '#ca8a04';
    textColor = '#0f172a';
  } else if (position === 'Defender') {
    jerseyColor = '#0f766e'; // Teal
    stripeColor = '#14b8a6';
    textColor = '#ffffff';
  } else if (position === 'Midfielder') {
    jerseyColor = '#4f46e5'; // Indigo
    stripeColor = '#6366f1';
    textColor = '#ffffff';
  } else if (position === 'Forward') {
    jerseyColor = '#be123c'; // Rose/Red
    stripeColor = '#f43f5e';
    textColor = '#ffffff';
  }

  // Choose a secondary stripe pattern based on hash
  const stripePattern = nameHash % 3;

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none overflow-hidden rounded-full bg-slate-100 border border-slate-200 shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background pitch visual */}
        <circle cx="50" cy="50" r="48" fill="#f8fafc" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />

        {/* Player Jersey Group */}
        <g transform="translate(10, 15)">
          {/* Jersey shoulders/sleeves */}
          <path
            d="M 15 50 L 5 35 L 20 20 L 35 30 L 65 30 L 80 20 L 95 35 L 85 50 Z"
            fill={jerseyColor}
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Sleeve stripes */}
          <path
            d="M 5 35 L 12 40 M 95 35 L 88 40"
            stroke={stripeColor}
            strokeWidth="4"
          />

          {/* Collar */}
          <path
            d="M 38 30 C 38 42, 62 42, 62 30"
            fill="#1e293b"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Main Jersey Body */}
          <path
            d="M 25 31 L 25 80 L 75 80 L 75 31 Z"
            fill={jerseyColor}
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Stripes/Patterns */}
          {stripePattern === 0 && (
            <>
              {/* Vertical Stripes */}
              <rect x="35" y="31" width="8" height="49" fill={stripeColor} />
              <rect x="57" y="31" width="8" height="49" fill={stripeColor} />
            </>
          )}
          {stripePattern === 1 && (
            <>
              {/* Horizontal Stripes */}
              <rect x="25" y="42" width="50" height="8" fill={stripeColor} />
              <rect x="25" y="60" width="50" height="8" fill={stripeColor} />
            </>
          )}
          {stripePattern === 2 && (
            <>
              {/* V-neck / Sash */}
              <path d="M 25 31 L 75 80 L 63 80 L 25 43 Z" fill={stripeColor} />
            </>
          )}

          {/* Squad Number text */}
          <text
            x="50"
            y="64"
            fill={textColor}
            fontSize="26"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {squadNumber !== null ? squadNumber : '?'}
          </text>
        </g>
      </svg>
    </div>
  );
};
