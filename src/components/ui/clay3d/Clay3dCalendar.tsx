import React from "react";

interface Clay3dCalendarProps {
  className?: string;
}

export default function Clay3dCalendar({ className = "w-12 h-12" }: Clay3dCalendarProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="calHeader" x1="15" y1="18" x2="85" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          <linearGradient id="calBody" x1="20" y1="35" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <linearGradient id="spiralRing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <filter id="calShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#000000" fillOpacity="0.16" />

        {/* Main Calendar Body Block */}
        <g filter="url(#calShadow)">
          {/* Back page thickness / 3D depth */}
          <rect x="23" y="24" width="56" height="58" rx="10" fill="#cbd5e1" />

          {/* Front Calendar Body */}
          <rect x="20" y="20" width="60" height="62" rx="10" fill="url(#calBody)" stroke="#e2e8f0" strokeWidth="1" />

          {/* Red/Coral Top Bar */}
          <path
            d="M20 30 C20 24.5 24.5 20 30 20 L70 20 C75.5 20 80 24.5 80 30 L80 40 L20 40 Z"
            fill="url(#calHeader)"
          />

          {/* Top Bar Specular Shine */}
          <path
            d="M22 23 C25 21 32 21 48 21 L78 21"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Spiral Ring Loops (4 wire loops) */}
          {[30, 43, 57, 70].map((cx, i) => (
            <g key={i}>
              <ellipse cx={cx} cy="18" rx="2.8" ry="6" fill="url(#spiralRing)" />
              <ellipse cx={cx} cy="18" rx="1.5" ry="4.5" fill="#1e293b" />
            </g>
          ))}

          {/* Calendar Grid Days */}
          {/* Row 1 */}
          <circle cx="32" cy="49" r="3" fill="#cbd5e1" />
          <circle cx="44" cy="49" r="3" fill="#cbd5e1" />
          <circle cx="56" cy="49" r="3" fill="#cbd5e1" />
          <circle cx="68" cy="49" r="3" fill="#cbd5e1" />

          {/* Row 2 */}
          <circle cx="32" cy="60" r="3" fill="#cbd5e1" />
          <circle cx="44" cy="60" r="3.5" fill="#f59e0b" />
          <circle cx="56" cy="60" r="3" fill="#cbd5e1" />
          <circle cx="68" cy="60" r="3" fill="#cbd5e1" />

          {/* Row 3 */}
          <circle cx="32" cy="71" r="3" fill="#cbd5e1" />
          <circle cx="44" cy="71" r="3" fill="#cbd5e1" />
          <circle cx="56" cy="71" r="4" fill="#3b82f6" />
          <circle cx="68" cy="71" r="3" fill="#cbd5e1" />
        </g>
      </svg>
    </div>
  );
}
