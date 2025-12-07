import { useState, useEffect } from 'react';

export function RobotVisual({ isListening, isAwake, isSpeaking }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isAwake || isSpeaking) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAwake, isSpeaking]);

  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-gray-400 to-gray-300 opacity-20" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-gray-300 to-white opacity-10" />
        </>
      )}

      <div className={`relative transition-transform duration-300 ${pulse ? 'scale-110' : 'scale-100'}`}>
        <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${
          isAwake ? 'opacity-60' : 'opacity-30'
        } ${
          isSpeaking ? 'bg-white' : 'bg-gray-400'
        }`} />

        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="relative z-10 drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="75%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a8a8a8" />
            </linearGradient>

            <linearGradient id="darkMetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>

            <radialGradient id="glowGradient">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.2" />
            </radialGradient>

            <filter id="metalEffect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="2" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <circle cx="150" cy="150" r="140" fill="url(#metalGradient)" filter="url(#metalEffect)" />

          <ellipse cx="150" cy="140" rx="120" ry="115" fill="url(#darkMetalGradient)" opacity="0.3" />

          <ellipse cx="110" cy="120" rx="20" ry="28" fill="url(#metalGradient)" />
          <ellipse cx="190" cy="120" rx="20" ry="28" fill="url(#metalGradient)" />

          <circle
            cx="110"
            cy="120"
            r="12"
            fill={isAwake || isSpeaking ? "#ffffff" : "#3b82f6"}
            className={isAwake || isSpeaking ? "animate-pulse" : ""}
          />
          <circle
            cx="190"
            cy="120"
            r="12"
            fill={isAwake || isSpeaking ? "#ffffff" : "#3b82f6"}
            className={isAwake || isSpeaking ? "animate-pulse" : ""}
          />

          {(isAwake || isSpeaking) && (
            <>
              <circle cx="110" cy="120" r="6" fill="#ffffff" opacity="0.9" />
              <circle cx="190" cy="120" r="6" fill="#ffffff" opacity="0.9" />
            </>
          )}

          <path
            d="M 100 180 Q 150 160 200 180"
            fill="none"
            stroke="url(#darkMetalGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <rect x="60" y="70" width="180" height="8" rx="4" fill="url(#metalGradient)" opacity="0.6" />

          <circle cx="80" cy="74" r="3" fill="#9ca3af" />
          <circle cx="100" cy="74" r="3" fill="#9ca3af" />
          <circle cx="200" cy="74" r="3" fill="#9ca3af" />
          <circle cx="220" cy="74" r="3" fill="#9ca3af" />

          {isListening && (
            <>
              <circle cx="150" cy="220" r="4" fill="#d1d5db" className="animate-ping" />
              <circle cx="130" cy="225" r="3" fill="#d1d5db" className="animate-ping" style={{animationDelay: '0.2s'}} />
              <circle cx="170" cy="225" r="3" fill="#d1d5db" className="animate-ping" style={{animationDelay: '0.4s'}} />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
