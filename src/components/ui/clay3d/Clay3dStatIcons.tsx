import React from "react";

// 1. 3D Gold Coin (Points)
export function Clay3dCoin({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="coinRim" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="coinFace" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        {/* Outer Rim */}
        <circle cx="20" cy="20" r="17" fill="url(#coinRim)" />
        {/* Inner Embossed Face */}
        <circle cx="20" cy="20" r="13" fill="url(#coinFace)" stroke="#fef08a" strokeWidth="1" />
        {/* Star / Sparkle in center */}
        <path
          d="M20 12 L22 17 L27 18 L23 22 L24 27 L20 24 L16 27 L17 22 L13 18 L18 17 Z"
          fill="#ffffff"
          fillOpacity="0.9"
        />
        {/* Specular Highlight */}
        <ellipse cx="15" cy="14" rx="4" ry="2" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30 15 14)" />
      </svg>
    </div>
  );
}

// 2. 3D Purple Target / Compass (Courses)
export function Clay3dTarget({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="targetRing" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="targetCenter" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>
        {/* Outer Ring */}
        <circle cx="20" cy="20" r="17" fill="url(#targetRing)" />
        {/* White Ring */}
        <circle cx="20" cy="20" r="12" fill="#ffffff" />
        {/* Center Bullseye */}
        <circle cx="20" cy="20" r="7" fill="url(#targetCenter)" />
        <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
        {/* Top-left Specular */}
        <ellipse cx="14" cy="13" rx="3" ry="1.5" fill="#ffffff" fillOpacity="0.7" transform="rotate(-25 14 13)" />
      </svg>
    </div>
  );
}

// 3. 3D Golden Diploma / Scroll (Certificates)
export function Clay3dDiploma({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="scrollPaper" x1="5" y1="10" x2="35" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* Rolled Certificate Cylinder */}
        <rect x="7" y="12" width="26" height="16" rx="4" fill="url(#scrollPaper)" stroke="#d97706" strokeWidth="0.8" />
        {/* Cylinder Ends Roll */}
        <ellipse cx="7" cy="20" rx="3" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="0.8" />
        <ellipse cx="33" cy="20" rx="3" ry="8" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
        {/* Red Ribbon Band around center */}
        <rect x="18" y="11" width="5" height="18" rx="1.5" fill="url(#ribbonGrad)" />
        {/* Ribbon Tails */}
        <polygon points="18,28 15,36 19,33 21,36 21,28" fill="url(#ribbonGrad)" />
      </svg>
    </div>
  );
}

// 4. 3D Game Controller (Challenges)
export function Clay3dGamepad({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <defs>
          <linearGradient id="padBody" x1="5" y1="10" x2="35" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        {/* Main Controller Shell */}
        <path
          d="M10 13 C14 12 26 12 30 13 C35 14 37 20 35 28 C34 33 28 34 26 30 L23 24 L17 24 L14 30 C12 34 6 33 5 28 C3 20 5 14 10 13 Z"
          fill="url(#padBody)"
        />
        {/* D-Pad (Left) */}
        <rect x="9" y="18" width="7" height="2.5" rx="1" fill="#1e1b4b" />
        <rect x="11.25" y="15.75" width="2.5" height="7" rx="1" fill="#1e1b4b" />
        {/* Action Buttons (Right) */}
        <circle cx="28" cy="17" r="1.5" fill="#f43f5e" />
        <circle cx="31" cy="20" r="1.5" fill="#eab308" />
        <circle cx="25" cy="20" r="1.5" fill="#10b981" />
        <circle cx="28" cy="23" r="1.5" fill="#38bdf8" />
        {/* Specular Glaze */}
        <path d="M12 15 C16 14 24 14 28 15" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
