import React from "react";

interface Clay3dBrainProps {
  className?: string;
  size?: number;
}

export default function Clay3dBrain({ className = "w-20 h-20 sm:w-24 sm:h-24", size = 120 }: Clay3dBrainProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)]"
      >
        <defs>
          {/* Main Brain Clay Gradients */}
          <linearGradient id="brainTopLight" x1="40" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff5eb" />
            <stop offset="25%" stopColor="#fed7aa" />
            <stop offset="65%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="brainLeftLobe" x1="25" y1="35" x2="80" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          <linearGradient id="brainRightLobe" x1="80" y1="35" x2="135" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="45%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Crevice Ambient Occlusion */}
          <linearGradient id="creviceShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#431407" stopOpacity="0.95" />
          </linearGradient>

          {/* Lightning Gold Gradients */}
          <linearGradient id="lightningGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="lightningEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Specular Highlight */}
          <radialGradient id="specularGlow" cx="45%" cy="30%" r="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Soft Drop Shadow Filter */}
          <filter id="clayShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#7c2d12" floodOpacity="0.25" />
          </filter>
          <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#eab308" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Brain Ground Shadow */}
        <ellipse cx="80" cy="142" rx="52" ry="14" fill="#000000" fillOpacity="0.12" />
        <ellipse cx="80" cy="140" rx="42" ry="10" fill="#7c2d12" fillOpacity="0.18" />

        {/* Left Hemisphere Clay Mass */}
        <g filter="url(#clayShadow)">
          {/* Base shape left */}
          <path
            d="M78 36 C55 35 34 50 32 74 C30 92 40 108 52 118 C62 126 74 130 78 132 Z"
            fill="url(#brainLeftLobe)"
          />
          {/* Left Lobe 1 (Frontal) */}
          <path
            d="M44 48 C36 56 36 70 46 76 C56 82 66 74 68 64 C70 54 54 40 44 48 Z"
            fill="url(#brainTopLight)"
            opacity="0.9"
          />
          {/* Left Lobe 2 (Temporal) */}
          <path
            d="M36 78 C30 88 34 104 46 108 C58 112 66 102 66 92 C66 82 44 70 36 78 Z"
            fill="url(#brainLeftLobe)"
          />
          {/* Left Lobe 3 (Occipital base) */}
          <path
            d="M50 108 C46 118 56 126 68 126 C76 126 78 116 76 110 C72 102 54 100 50 108 Z"
            fill="url(#brainLeftLobe)"
          />
        </g>

        {/* Right Hemisphere Clay Mass */}
        <g filter="url(#clayShadow)">
          {/* Base shape right */}
          <path
            d="M82 36 C105 35 126 50 128 74 C130 92 120 108 108 118 C98 126 86 130 82 132 Z"
            fill="url(#brainRightLobe)"
          />
          {/* Right Lobe 1 (Frontal) */}
          <path
            d="M116 48 C124 56 124 70 114 76 C104 82 94 74 92 64 C90 54 106 40 116 48 Z"
            fill="url(#brainTopLight)"
            opacity="0.8"
          />
          {/* Right Lobe 2 (Temporal) */}
          <path
            d="M124 78 C130 88 126 104 114 108 C102 112 94 102 94 92 C94 82 116 70 124 78 Z"
            fill="url(#brainRightLobe)"
          />
          {/* Right Lobe 3 (Occipital base) */}
          <path
            d="M110 108 C114 118 104 126 92 126 C84 126 82 116 84 110 C88 102 106 100 110 108 Z"
            fill="url(#brainRightLobe)"
          />
        </g>

        {/* Central Sulcus / Deep Crevice */}
        <path
          d="M78 36 C80 44 81 58 79 70 C77 82 82 98 80 114 C79 122 80 130 80 132"
          stroke="url(#creviceShadow)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Secondary Sulci (Folds) */}
        <path
          d="M48 62 C58 64 68 62 76 68"
          stroke="#9a3412"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M42 90 C54 92 64 88 74 94"
          stroke="#9a3412"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M112 62 C102 64 92 62 84 68"
          stroke="#7c2d12"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M118 90 C106 92 96 88 86 94"
          stroke="#7c2d12"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Smooth Specular Glaze (Clay Luster) */}
        <ellipse cx="60" cy="52" rx="18" ry="10" fill="url(#specularGlow)" transform="rotate(-15 60 52)" />
        <ellipse cx="100" cy="52" rx="14" ry="8" fill="url(#specularGlow)" transform="rotate(15 100 52)" />
        <circle cx="50" cy="46" r="3.5" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="94" cy="46" r="2.5" fill="#ffffff" fillOpacity="0.75" />

        {/* 3D Golden Lightning Bolt 1 (Large, floating on right) */}
        <g filter="url(#boltGlow)">
          <path
            d="M128 22 L144 22 L132 46 L148 46 L118 78 L126 52 L114 52 Z"
            fill="url(#lightningGrad)"
            stroke="url(#lightningEdge)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Bolt facet highlight */}
          <path
            d="M128 22 L144 22 L132 46 L124 46 Z"
            fill="#ffffff"
            fillOpacity="0.45"
          />
        </g>

        {/* 3D Golden Lightning Bolt 2 (Small, floating on top-left) */}
        <g filter="url(#boltGlow)">
          <path
            d="M26 38 L36 38 L28 54 L38 54 L20 74 L25 58 L18 58 Z"
            fill="url(#lightningGrad)"
            stroke="url(#lightningEdge)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
