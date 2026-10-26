import React from "react";

interface Clay3dPaletteBrushProps {
  className?: string;
}

export default function Clay3dPaletteBrush({ className = "w-12 h-12" }: Clay3dPaletteBrushProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Wood Palette Gradients */}
          <linearGradient id="woodSurface" x1="20" y1="20" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="woodEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Paint Dollops Gloss */}
          <radialGradient id="paintEmerald" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>

          <radialGradient id="paintRose" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </radialGradient>

          <radialGradient id="paintBlue" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="60%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          <radialGradient id="paintPurple" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="60%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </radialGradient>

          {/* Brush Gradients */}
          <linearGradient id="brushHandle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="brushFerrule" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <filter id="palShadow" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="88" rx="38" ry="7" fill="#000000" fillOpacity="0.16" />

        {/* Palette Board */}
        <g filter="url(#palShadow)">
          {/* Under edge for 3D thickness */}
          <path
            d="M20 52 C15 32 30 18 52 18 C72 18 84 28 86 48 C88 64 78 80 58 84 C44 87 36 78 30 76 C24 74 18 70 16 62 Z"
            fill="url(#woodEdge)"
          />
          {/* Upper surface */}
          <path
            d="M20 50 C15 30 30 16 52 16 C72 16 84 26 86 46 C88 62 78 78 58 82 C44 85 36 76 30 74 C24 72 18 68 16 60 Z"
            fill="url(#woodSurface)"
          />

          {/* Thumb Hole */}
          <ellipse cx="70" cy="56" rx="7" ry="9" fill="#1e1b18" />
          <ellipse cx="70" cy="55" rx="6" ry="8" fill="#f8fafc" />

          {/* Paint Dollops */}
          {/* Emerald */}
          <circle cx="34" cy="28" r="6" fill="url(#paintEmerald)" />
          <circle cx="32" cy="26" r="1.5" fill="#ffffff" fillOpacity="0.8" />

          {/* Rose */}
          <circle cx="50" cy="24" r="6.5" fill="url(#paintRose)" />
          <circle cx="48" cy="22" r="1.5" fill="#ffffff" fillOpacity="0.8" />

          {/* Blue */}
          <circle cx="68" cy="30" r="6" fill="url(#paintBlue)" />
          <circle cx="66" cy="28" r="1.5" fill="#ffffff" fillOpacity="0.8" />

          {/* Purple */}
          <circle cx="28" cy="44" r="5.5" fill="url(#paintPurple)" />
          <circle cx="26" cy="42" r="1.5" fill="#ffffff" fillOpacity="0.8" />
        </g>

        {/* 3D Paintbrush crossing across */}
        <g transform="rotate(-32 45 60)">
          {/* Handle */}
          <rect x="42" y="22" width="5" height="52" rx="2.5" fill="url(#brushHandle)" />
          {/* Ferrule (Metal) */}
          <rect x="41" y="70" width="7" height="10" rx="1.5" fill="url(#brushFerrule)" />
          {/* Bristles Dipped in Paint */}
          <path d="M41 80 C41 87 43 92 44.5 94 C46 92 48 87 48 80 Z" fill="#ec4899" />
          <circle cx="44.5" cy="93" r="1.5" fill="#fbcfe8" />
        </g>
      </svg>
    </div>
  );
}
