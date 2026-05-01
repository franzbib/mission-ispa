import { useState } from 'react';
import { useGameStore } from '../../engine/gameState';
import { getLocationState } from '../../engine/unlockEngine';
import { LOCATIONS } from '../../data/locations';

export default function InteractiveMap({ onLocationClick }: { onLocationClick?: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const gameState = useGameStore((state) => state);

  const locations = LOCATIONS.map(loc => ({
    ...loc,
    state: getLocationState(loc.id, gameState)
  })).filter(loc => loc.state !== 'hidden');

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing relative">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <svg viewBox="0 0 1000 700" className="w-full max-w-6xl max-h-full drop-shadow-2xl z-10">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* River (La Somme) */}
        <path d="M -100,400 Q 200,450 500,350 T 1100,300" fill="none" stroke="url(#riverGrad)" strokeWidth="40" strokeLinecap="round" />
        <path d="M -100,400 Q 200,450 500,350 T 1100,300" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.3" strokeDasharray="10 5" />
        
        {/* Main Roads */}
        <path d="M 200,-50 L 250,750 M 450,-50 L 480,750 M 650,-50 L 700,750" fill="none" stroke="url(#roadGrad)" strokeWidth="12" />
        <path d="M -50,200 L 1050,250 M -50,550 L 1050,500" fill="none" stroke="url(#roadGrad)" strokeWidth="12" />

        {/* Locations */}
        {locations.map((loc) => {
          const isUnlocked = loc.state === 'unlocked' || loc.state === 'completed';
          const isDiscovered = loc.state === 'discovered';
          
          return (
          <g 
            key={loc.id} 
            transform={`translate(${loc.cx}, ${loc.cy})`}
            onMouseEnter={() => setHovered(loc.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onLocationClick?.(loc.id)}
            className={isUnlocked ? 'cursor-pointer' : isDiscovered ? 'cursor-help grayscale opacity-70' : ''}
          >
            {/* Hover Ping */}
            {hovered === loc.id && isUnlocked && (
              <circle r="45" fill={loc.color} className="animate-ping opacity-20" />
            )}
            
            {/* Outer Ring */}
            <circle 
              r="30" 
              fill={isUnlocked ? `${loc.color}33` : '#334155'} 
              stroke={isUnlocked ? loc.color : '#64748b'} 
              strokeWidth="2"
              className="transition-all duration-500"
              transform={hovered === loc.id && isUnlocked ? 'scale(1.3)' : 'scale(1)'}
              filter={hovered === loc.id && isUnlocked ? 'url(#glow)' : ''}
            />

            {/* Inner Dark Circle */}
            <circle 
              r="22" 
              fill="#0f172a" 
              className="transition-all duration-300"
              transform={hovered === loc.id && isUnlocked ? 'scale(1.1)' : 'scale(1)'}
            />

            {/* Icon */}
            {isUnlocked ? (
              <>
                <path 
                  d={loc.icon} 
                  fill="none" 
                  stroke={loc.color} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  transform="translate(-12, -12) scale(1)"
                />
                {loc.state === 'completed' && (
                  <circle cx="12" cy="-12" r="6" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                )}
              </>
            ) : (
              <path 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                fill="none" 
                stroke="#94a3b8" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                transform="translate(-12, -12) scale(1)"
              />
            )}

            {/* Text Label Container */}
            {(() => {
              const textWidth = loc.name.length * 8 + 30; // Approx width
              const anchor = loc.labelAnchor || "middle";
              
              const hoverOffset = hovered === loc.id ? -10 : 0;
              const defaultOffsetY = -45;
              const offsetX = loc.labelOffsetX || 0;
              const offsetY = (loc.labelOffsetY !== undefined ? loc.labelOffsetY : defaultOffsetY) + hoverOffset;

              let rectX = -(textWidth / 2);
              let textX = 0;

              if (anchor === "start") {
                rectX = -10;
                textX = 5;
              } else if (anchor === "end") {
                rectX = -textWidth + 10;
                textX = -5;
              }

              return (
                <g 
                  transform={`translate(${offsetX}, ${offsetY})`}
                  className={`transition-all duration-300 ${hovered === loc.id ? 'opacity-100' : 'opacity-70'}`}
                >
                  {/* Text background pill */}
                  <rect 
                    x={rectX} 
                    y="-14" 
                    width={textWidth} 
                    height="24" 
                    rx="12" 
                    fill="#1e293b" 
                    stroke={isUnlocked ? loc.color : '#475569'}
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <text 
                    x={textX}
                    y="3" 
                    textAnchor={anchor} 
                    fill={isUnlocked ? "#f8fafc" : "#94a3b8"} 
                    className="font-sans font-semibold text-xs tracking-wide"
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })()}
          </g>
          );
        })}
      </svg>
    </div>
  );
}
