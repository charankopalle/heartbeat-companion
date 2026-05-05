// Renders a real ECG buffer as a polyline. Auto-scales vertically and
// shows a flat line + hint when no data is present.

const ECGWaveform = ({
  samples,
  color = "hsl(var(--ecg))",
  height = 160,
}: { samples: number[]; color?: string; height?: number }) => {
  const W = 600;
  const H = height;
  const n = samples.length;

  let path = `M 0 ${H / 2} L ${W} ${H / 2}`;
  if (n > 1) {
    let min = Infinity, max = -Infinity;
    for (const s of samples) { if (s < min) min = s; if (s > max) max = s; }
    const range = max - min || 1;
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * W;
      const y = H - ((samples[i] - min) / range) * (H * 0.8) - H * 0.1;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    path = "M" + pts.join(" L");
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-primary-soft/40" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <pattern id="ecg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--ecg-grid))" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#ecg-grid)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {n < 2 && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-xs text-muted-foreground font-medium">No live signal</p>
        </div>
      )}
    </div>
  );
};

export default ECGWaveform;
