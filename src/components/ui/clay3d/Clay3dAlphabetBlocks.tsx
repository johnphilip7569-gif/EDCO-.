import React from "react";

interface Clay3dAlphabetBlocksProps {
  className?: string;
}

export default function Clay3dAlphabetBlocks({ className = "w-12 h-12" }: Clay3dAlphabetBlocksProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Block A (Red) Gradients */}
          <linearGradient id="redTop" x1="20" y1="20" x2="60" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="redFront" x1="20" y1="40" x2="20" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="redSide" x1="50" y1="40" x2="70" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Block B (Yellow/Gold) Gradients */}
          <linearGradient id="yellowTop" x1="45" y1="10" x2="85" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
          <linearGradient id="yellowFront" x1="45" y1="30" x2="45" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="yellowSide" x1="70" y1="30" x2="90" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Block C (Cyan/Teal) Gradients */}
          <linearGradient id="cyanTop" x1="10" y1="50" x2="45" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="cyanFront" x1="10" y1="65" x2="10" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          <linearGradient id="cyanSide" x1="30" y1="65" x2="50" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#155e75" />
          </linearGradient>

          <filter id="blockShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="50" cy="88" rx="38" ry="8" fill="#000000" fillOpacity="0.14" />

        {/* BLOCK B (Upper Right, Behind A & C) */}
        <g filter="url(#blockShadow)">
          {/* Top Face */}
          <polygon points="62,12 84,23 66,35 44,24" fill="url(#yellowTop)" />
          {/* Front Left Face */}
          <polygon points="44,24 66,35 66,58 44,47" fill="url(#yellowFront)" />
          {/* Front Right Face */}
          <polygon points="66,35 84,23 84,46 66,58" fill="url(#yellowSide)" />
          {/* Letter B on Front Face */}
          <text
            x="54"
            y="46"
            fill="#713f12"
            fontSize="15"
            fontWeight="900"
            fontFamily="sans-serif"
            textAnchor="middle"
            transform="skewY(18) scale(0.9, 1.1)"
          >
            B
          </text>
        </g>

        {/* BLOCK A (Center Front) */}
        <g filter="url(#blockShadow)">
          {/* Top Face */}
          <polygon points="38,28 62,40 42,54 18,42" fill="url(#redTop)" />
          {/* Front Left Face */}
          <polygon points="18,42 42,54 42,80 18,68" fill="url(#redFront)" />
          {/* Front Right Face */}
          <polygon points="42,54 62,40 62,66 42,80" fill="url(#redSide)" />
          {/* Letter A on Front Face */}
          <text
            x="29"
            y="67"
            fill="#ffffff"
            fontSize="18"
            fontWeight="900"
            fontFamily="sans-serif"
            textAnchor="middle"
            transform="skewY(18) scale(0.95, 1.15)"
          >
            A
          </text>
        </g>

        {/* BLOCK C (Lower Left, Front Foreground) */}
        <g filter="url(#blockShadow)">
          {/* Top Face */}
          <polygon points="60,52 80,62 64,74 44,64" fill="url(#cyanTop)" />
          {/* Front Left Face */}
          <polygon points="44,64 64,74 64,94 44,84" fill="url(#cyanFront)" />
          {/* Front Right Face */}
          <polygon points="64,74 80,62 80,82 64,94" fill="url(#cyanSide)" />
          {/* Letter C on Front Face */}
          <text
            x="53"
            y="85"
            fill="#ffffff"
            fontSize="14"
            fontWeight="900"
            fontFamily="sans-serif"
            textAnchor="middle"
            transform="skewY(18) scale(0.9, 1.1)"
          >
            C
          </text>
        </g>
      </svg>
    </div>
  );
}
