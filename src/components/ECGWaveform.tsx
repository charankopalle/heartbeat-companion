import { useEffect, useRef, useState } from "react";

/** Generates a continuous, scrolling ECG waveform via SVG. */
const ECGWaveform = ({ color = "hsl(var(--ecg))", bpm = 78 }: { color?: string; bpm?: number }) => {
  const W = 600; // logical width
  const H = 160;
  const [offset, setOffset] = useState(0);
  const raf = useRef<number>();
  const speed = (bpm / 60) * 60; // px/s

  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      setOffset((o) => (o + dt * speed) % W);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [speed]);

  // Build one PQRST complex repeated across the width
  const buildPath = (shift: number) => {
    const pts: string[] = [];
    const beatWidth = 80;
    for (let x = -beatWidth; x < W + beatWidth; x += 1) {
      const phase = ((x + shift) % beatWidth + beatWidth) % beatWidth;
      let y = H / 2;
      if (phase < 8) y -= Math.sin((phase / 8) * Math.PI) * 6; // P
      else if (phase < 18) y += 0;
      else if (phase < 22) y += 8; // Q
      else if (phase < 26) y -= 60; // R spike
      else if (phase < 30) y += 18; // S
      else if (phase < 50) y -= Math.sin(((phase - 30) / 20) * Math.PI) * 10; // T
      pts.push(`${x},${y.toFixed(2)}`);
    }
    return "M" + pts.join(" L");
  };

  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-primary-soft/40">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--ecg-grid))" strokeWidth="0.6" />
          </pattern>
          <linearGradient id="fade" x1="0" x2="1">
            <stop offset="0" stopColor={color} stopOpacity="0" />
            <stop offset="0.15" stopColor={color} stopOpacity="1" />
            <stop offset="1" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        <path d={buildPath(offset)} fill="none" stroke="url(#fade)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Right edge glow */}
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-primary-soft/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default ECGWaveform;
