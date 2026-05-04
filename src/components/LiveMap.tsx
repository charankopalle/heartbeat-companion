import { useEffect, useState } from "react";

const LiveMap = ({ progress }: { progress: number }) => {
  // Path from top-right (ambulance start) to bottom-left (patient)
  const path = "M 320 60 Q 260 140 220 200 T 120 320 Q 90 360 70 420";
  const [pos, setPos] = useState({ x: 320, y: 60 });

  useEffect(() => {
    const svgPath = document.getElementById("ambulance-path") as unknown as SVGPathElement | null;
    if (!svgPath) return;
    const len = svgPath.getTotalLength();
    const pt = svgPath.getPointAtLength(len * progress);
    setPos({ x: pt.x, y: pt.y });
  }, [progress]);

  return (
    <div className="relative w-full h-[560px] overflow-hidden">
      {/* Map background */}
      <svg viewBox="0 0 400 560" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="mapBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="hsl(210 50% 96%)" />
            <stop offset="1" stopColor="hsl(210 60% 92%)" />
          </linearGradient>
        </defs>
        <rect width="400" height="560" fill="url(#mapBg)" />

        {/* Park blocks */}
        <rect x="20" y="80" width="100" height="80" rx="12" fill="hsl(152 45% 85%)" />
        <rect x="260" y="380" width="120" height="100" rx="12" fill="hsl(152 45% 85%)" />
        <rect x="160" y="40" width="60" height="50" rx="10" fill="hsl(210 30% 90%)" />
        <rect x="40" y="280" width="80" height="60" rx="10" fill="hsl(210 30% 90%)" />
        <rect x="280" y="200" width="100" height="70" rx="10" fill="hsl(210 30% 90%)" />

        {/* Roads */}
        <g stroke="white" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M -10 200 L 410 200" />
          <path d="M -10 380 L 410 380" />
          <path d="M 150 -10 L 150 570" />
          <path d="M 320 -10 L 320 570" />
        </g>
        <g stroke="hsl(210 25% 80%)" strokeWidth="1" strokeDasharray="6 8" fill="none">
          <path d="M -10 200 L 410 200" />
          <path d="M -10 380 L 410 380" />
          <path d="M 150 -10 L 150 570" />
          <path d="M 320 -10 L 320 570" />
        </g>

        {/* Route */}
        <path id="ambulance-path" d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 8" />
        <path d={path} fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="12" strokeLinecap="round" />

        {/* Patient pin (destination) */}
        <g transform="translate(70, 420)">
          <circle r="22" fill="hsl(var(--primary) / 0.18)" />
          <circle r="14" fill="hsl(var(--primary))" />
          <circle r="5" fill="white" />
        </g>

        {/* Hospital pin (start) */}
        <g transform="translate(320, 60)">
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="hsl(var(--destructive))" />
          <path d="M -2 -7 L 2 -7 L 2 -2 L 7 -2 L 7 2 L 2 2 L 2 7 L -2 7 L -2 2 L -7 2 L -7 -2 L -2 -2 Z" fill="white" />
        </g>

        {/* Ambulance moving */}
        <g transform={`translate(${pos.x}, ${pos.y})`}>
          <circle r="18" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
          <text textAnchor="middle" y="5" fontSize="16">🚑</text>
        </g>
      </svg>
    </div>
  );
};

export default LiveMap;
