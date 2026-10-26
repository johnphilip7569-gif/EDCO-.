import React from "react";

interface MyraTeddyMascotProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export default function MyraTeddyMascot({
  className = "w-48 h-48 sm:w-56 sm:h-56",
  size = 220,
  interactive = true,
}: MyraTeddyMascotProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${className} ${
        interactive ? "cursor-pointer group" : ""
      }`}
      title="Myra AI Teacher — Click to Ask Anything"
    >
      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Fur Gradient - Warm Honey Gold */}
          <linearGradient id="teddyFur" x1="60" y1="40" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Ear Pink Shadow */}
          <radialGradient id="earPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>

          {/* Pants / Apron Blue */}
          <linearGradient id="teddyPants" x1="70" y1="140" x2="150" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Bowtie Crimson */}
          <linearGradient id="bowtieRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Glasses Frame Red */}
          <linearGradient id="glassesRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* 3D Cube Floating Gradient */}
          <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>

          {/* Atom Ring Gradient */}
          <linearGradient id="atomGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* Soft Ground Shadow */}
          <filter id="teddyShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#ca8a04" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Floating 3D Geometric Badge 1: Isometric Cube (Top-Left) */}
        <g transform="translate(14, 28) scale(0.75)" className="transition-transform duration-500 group-hover:-translate-y-1">
          <rect x="0" y="0" width="34" height="34" rx="10" fill="#ffedd5" />
          {/* Wireframe Cube */}
          <polygon points="17,6 27,11 17,17 7,11" fill="#fdba74" />
          <polygon points="7,11 17,17 17,28 7,22" fill="#fb923c" />
          <polygon points="17,17 27,11 27,22 17,28" fill="#ea580c" />
        </g>

        {/* Floating 3D Geometric Badge 2: Atom Ring (Mid-Left) */}
        <g transform="translate(14, 78) scale(0.75)" className="transition-transform duration-500 group-hover:translate-x-1">
          <rect x="0" y="0" width="34" height="34" rx="10" fill="#eff6ff" />
          {/* Quantum Orbits */}
          <ellipse cx="17" cy="17" rx="9" ry="3.5" fill="none" stroke="#3b82f6" strokeWidth="1.5" transform="rotate(30 17 17)" />
          <ellipse cx="17" cy="17" rx="9" ry="3.5" fill="none" stroke="#3b82f6" strokeWidth="1.5" transform="rotate(-30 17 17)" />
          <circle cx="17" cy="17" r="2.5" fill="#2563eb" />
        </g>

        {/* Ground Drop Shadow */}
        <ellipse cx="115" cy="195" rx="55" ry="9" fill="#000000" fillOpacity="0.08" />

        {/* Tail (Wagging Behind Left) */}
        <path
          d="M74 150 C55 145 42 160 52 175 C58 184 72 172 76 162 Z"
          fill="url(#teddyFur)"
        />

        {/* MAIN BODY & HEAD (Plump friendly character) */}
        <g filter="url(#teddyShadow)">
          {/* Left Ear */}
          <ellipse cx="78" cy="62" rx="15" ry="17" fill="url(#teddyFur)" transform="rotate(-15 78 62)" />
          <ellipse cx="78" cy="63" rx="8" ry="9" fill="url(#earPink)" transform="rotate(-15 78 63)" />

          {/* Right Ear */}
          <ellipse cx="148" cy="62" rx="15" ry="17" fill="url(#teddyFur)" transform="rotate(15 148 62)" />
          <ellipse cx="148" cy="63" rx="8" ry="9" fill="url(#earPink)" transform="rotate(15 148 63)" />

          {/* Plump Rounded Body */}
          <path
            d="M75 95 C70 65 156 65 151 95 C162 125 168 185 146 188 C124 190 102 190 80 188 C58 185 64 125 75 95 Z"
            fill="url(#teddyFur)"
          />

          {/* Blue Pants / Dungarees */}
          <path
            d="M73 148 C75 145 151 145 153 148 C158 165 156 188 144 188 L120 188 L120 176 L106 176 L106 188 L82 188 C70 188 68 165 73 148 Z"
            fill="url(#teddyPants)"
          />

          {/* Feet */}
          <ellipse cx="94" cy="189" rx="12" ry="5" fill="#1e3a8a" />
          <ellipse cx="132" cy="189" rx="12" ry="5" fill="#1e3a8a" />

          {/* White Chest Apron / Shirt bib */}
          <path
            d="M90 120 L136 120 L130 148 L96 148 Z"
            fill="#ffffff"
          />

          {/* Red Suspenders */}
          <rect x="91" y="120" width="5" height="28" fill="#ef4444" rx="1" />
          <rect x="130" y="120" width="5" height="28" fill="#ef4444" rx="1" />

          {/* Red Bowtie at Neck */}
          <g transform="translate(113, 118)">
            <polygon points="-12,-6 0,-2 -12,6" fill="url(#bowtieRed)" />
            <polygon points="12,-6 0,-2 12,6" fill="url(#bowtieRed)" />
            <circle cx="0" cy="0" r="3.5" fill="#b91c1c" />
          </g>

          {/* Oversized Red Nerd Glasses */}
          {/* Left Lens Frame */}
          <rect x="80" y="88" width="28" height="22" rx="7" fill="#ffffff" stroke="url(#glassesRed)" strokeWidth="3" />
          {/* Right Lens Frame */}
          <rect x="118" y="88" width="28" height="22" rx="7" fill="#ffffff" stroke="url(#glassesRed)" strokeWidth="3" />
          {/* Glasses Bridge */}
          <line x1="108" y1="99" x2="118" y2="99" stroke="url(#glassesRed)" strokeWidth="3" strokeLinecap="round" />

          {/* Eyes (Friendly Happy Arcs behind glasses) */}
          <path d="M89 97 C91 94 97 94 99 97" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M127 97 C129 94 135 94 137 97" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cute Button Nose & Smiling Mouth */}
          <ellipse cx="113" cy="107" rx="3.5" ry="2.5" fill="#78350f" />
          <path d="M113 109.5 L113 112" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M109 112 C111 114 115 114 117 112" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="80" cy="107" rx="4" ry="2" fill="#f472b6" fillOpacity="0.6" />
          <ellipse cx="146" cy="107" rx="4" ry="2" fill="#f472b6" fillOpacity="0.6" />

          {/* Cute Whiskers */}
          <line x1="72" y1="104" x2="65" y2="103" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="72" y1="108" x2="64" y2="109" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="154" y1="104" x2="161" y2="103" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="154" y1="108" x2="162" y2="109" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right Arm Holding Wooden Teacher Pointer */}
        <g>
          {/* Arm Sleeve */}
          <ellipse cx="152" cy="132" rx="8" ry="12" fill="url(#teddyFur)" transform="rotate(-30 152 132)" />
          {/* Hand/Paw */}
          <circle cx="160" cy="124" r="6" fill="#fde047" />

          {/* Wooden Pointer Stick */}
          <line
            x1="156"
            y1="130"
            x2="198"
            y2="76"
            stroke="#92400e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Silver Tip */}
          <circle cx="198" cy="76" r="2.5" fill="#f59e0b" />
        </g>

        {/* Hand-Written Science Formula: E=mc² */}
        <g transform="translate(186, 68)">
          <text
            x="0"
            y="0"
            fill="#d97706"
            fontFamily="monospace, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="-0.5"
          >
            E=mc²
          </text>
        </g>

        {/* Small Minus & Plus Chalk Glyphs Floating */}
        <rect x="52" y="112" width="10" height="3" rx="1.5" fill="#ef4444" />
        <g transform="translate(182, 42)">
          <rect x="0" y="3.5" width="9" height="2" rx="1" fill="#10b981" />
          <rect x="3.5" y="0" width="2" height="9" rx="1" fill="#10b981" />
        </g>
      </svg>
    </div>
  );
}
