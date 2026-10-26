import React from "react";

interface Clay3dNotepadPenProps {
  className?: string;
}

export default function Clay3dNotepadPen({ className = "w-12 h-12" }: Clay3dNotepadPenProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="padCover" x1="15" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="padBack" x1="15" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="penBody" x1="45" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <filter id="padShadow" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#000000" fillOpacity="0.16" />

        {/* Notepad (Tilted slightly -3deg) */}
        <g filter="url(#padShadow)" transform="rotate(-4 45 50)">
          {/* Cyan Back Cover / 3D Edge */}
          <rect x="18" y="16" width="56" height="66" rx="8" fill="url(#padBack)" />

          {/* White Paper Stack */}
          <rect x="21" y="18" width="53" height="63" rx="7" fill="url(#padCover)" stroke="#cbd5e1" strokeWidth="0.8" />

          {/* Ruled lines on paper */}
          <line x1="30" y1="32" x2="66" y2="32" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="41" x2="66" y2="41" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="50" x2="66" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="59" x2="56" y2="59" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Spiral binding on left side */}
          {[24, 33, 42, 51, 60, 69].map((cy, idx) => (
            <ellipse key={idx} cx="21" cy={cy} rx="3" ry="1.8" fill="#475569" />
          ))}
        </g>

        {/* 3D Angled Ballpoint Pen */}
        <g transform="rotate(38 68 55)">
          {/* Pen Shadow */}
          <rect x="66" y="22" width="7" height="52" rx="3.5" fill="#000000" fillOpacity="0.25" />

          {/* Pen Body */}
          <rect x="64" y="20" width="7" height="50" rx="3.5" fill="url(#penBody)" stroke="#fef3c7" strokeWidth="0.5" />

          {/* Pen Clip (Silver) */}
          <rect x="62" y="24" width="2" height="16" rx="1" fill="#e2e8f0" />

          {/* Pen Tip (Silver Cone & Dark Nib) */}
          <polygon points="64,70 71,70 67.5,78" fill="#e2e8f0" />
          <circle cx="67.5" cy="78" r="1" fill="#1e293b" />
        </g>
      </svg>
    </div>
  );
}
