import { useEffect, useRef, useState } from 'react';

export default function FalconBackground() {
  const mntRef = useRef(null);
  const pathRef = useRef(null);
  const falconRef = useRef(null);
  const [docHeight, setDocHeight] = useState(4000);

  // Measure initial document height for the flight path scaling
  useEffect(() => {
    const updateHeight = () => {
      setDocHeight(Math.max(document.body.scrollHeight, window.innerHeight * 2));
    };
    
    updateHeight();
    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // 60fps Scroll Physics Engine
  useEffect(() => {
    let rafId;
    let targetY = window.scrollY;
    let currentY = window.scrollY;

    const loop = () => {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * 0.045; // Increased from 0.015 to make it track a bit faster

      // 1. Mountain Parallax (Subtle downward movement clamped to freeze 1-2 inches above 2026-2027 BOARD badge)
      if (mntRef.current) {
        const shiftY = Math.min(currentY * 0.12, 50);
        mntRef.current.style.transform = `translateY(${shiftY}px)`;
      }

      // 2. Airstream & Falcon Tracker
      if (pathRef.current && falconRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        if (pathLength > 0) {
          // Reverted maxScroll to reach 100% at the bottom of the page,
          // but because the physical path now ends 400px higher (see generateFlightPath),
          // the bird will land at the end of the path AND be perfectly visible on screen!
          const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
          const scrollPerc = Math.min(Math.max(currentY / maxScroll, 0), 1);
          
          const dist = scrollPerc * pathLength;
          const pt = pathRef.current.getPointAtLength(dist);
          
          const lookahead = Math.min(dist + 2, pathLength);
          const pt2 = pathRef.current.getPointAtLength(lookahead);
          
          const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

          falconRef.current.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${angle + 90}deg)`;
          
          pathRef.current.style.strokeDasharray = pathLength;
          pathRef.current.style.strokeDashoffset = pathLength - dist;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    
    loop();
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Dynamically generate the winding bezier airstream
  const generateFlightPath = () => {
    const endY = docHeight > 1200 ? docHeight - 400 : docHeight; // End 400px above bottom
    const segments = Math.max(3, Math.floor(endY / 800));
    let d = `M 720 750 `;
    let currentY = 750;
    
    for (let i = 0; i < segments; i++) {
       const nextY = currentY + ((endY - 750) / segments);
       const cx1 = i % 2 === 0 ? 150 : 1290; 
       const cx2 = i % 2 === 0 ? 1290 : 150;
       d += `C ${cx1} ${currentY + 200}, ${cx2} ${nextY - 200}, 720 ${nextY} `;
       currentY = nextY;
    }
    return d;
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: `${docHeight}px`,
      zIndex: -1, pointerEvents: 'none', overflow: 'hidden'
    }}>
      
      {/* ── PARALLAX MOUNTAINS ── */}
      <div 
        ref={mntRef} 
        style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '700px', maxHeight: '700px',
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 90%)',
          willChange: 'transform' 
        }}
      >
        <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMax slice" style={{ width: '100%', height: '100%' }}>
          {/* Layer 1 (Back) */}
          <path fill="#350E18" d="M0,200 L150,450 L350,300 L550,550 L720,620 L890,500 L1100,250 L1300,450 L1440,300 L1440,1000 L0,1000 Z" />
          {/* Layer 2 */}
          <path fill="#501725" d="M0,350 L200,550 L450,450 L650,650 L720,680 L800,650 L950,400 L1200,550 L1440,400 L1440,1000 L0,1000 Z" />
          {/* Layer 3 */}
          <path fill="#7D2838" d="M0,500 L250,700 L500,600 L720,720 L950,550 L1250,700 L1440,500 L1440,1000 L0,1000 Z" />
          {/* Layer 4 (Front) */}
          <path fill="#9B364A" d="M0,650 L300,800 L550,700 L720,760 L900,650 L1200,850 L1440,650 L1440,1000 L0,1000 Z" />
        </svg>
      </div>

      {/* ── FLIGHT PATH & FALCON ── */}
      <svg viewBox={`0 0 1440 ${docHeight}`} preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          ref={pathRef}
          d={generateFlightPath()}
          fill="none"
          stroke="rgba(155, 54, 74, 0.4)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="20 15"
          filter="url(#glow)"
        />

        <g ref={falconRef} style={{ willChange: 'transform' }}>
          <g transform="translate(-24, -24)">
            {/* Falcon Body */}
            <path fill="#FFFFFF" filter="url(#glow)" d="M24,4 L18,24 L24,42 L30,24 Z" />
            
            {/* Left Wing (Animated) */}
            <path 
              fill="rgba(255, 255, 255, 0.9)" 
              d="M18,14 L-4,20 L16,28 Z" 
              style={{ transformOrigin: '18px 14px', animation: 'flapLeft 0.4s ease-in-out infinite alternate' }} 
            />
            
            {/* Right Wing (Animated) */}
            <path 
              fill="rgba(255, 255, 255, 0.9)" 
              d="M30,14 L52,20 L32,28 Z" 
              style={{ transformOrigin: '30px 14px', animation: 'flapRight 0.4s ease-in-out infinite alternate' }} 
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
