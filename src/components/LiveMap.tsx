// Stylized live map. Patient is centered at the bottom; ambulance position is
// projected from the doctor app's reported lat/lng (relative to the patient
// origin). When no GPS is available yet, the ambulance pin is hidden.

interface Props {
  ambulanceLat?: number;
  ambulanceLng?: number;
  patientLat?: number;
  patientLng?: number;
}

const LiveMap = ({ ambulanceLat, ambulanceLng, patientLat, patientLng }: Props) => {
  // Project lat/lng deltas to SVG coords using a tiny scale (~1 km ≈ 0.009°).
  const W = 400, H = 560;
  const patientPx = { x: 70, y: 420 };
  let ambPx: { x: number; y: number } | null = null;
  if (ambulanceLat != null && ambulanceLng != null && patientLat != null && patientLng != null) {
    const scale = 4000; // px per degree at this zoom
    const dx = (ambulanceLng - patientLng) * scale;
    const dy = (patientLat - ambulanceLat) * scale; // north is up
    ambPx = {
      x: Math.max(20, Math.min(W - 20, patientPx.x + dx)),
      y: Math.max(20, Math.min(H - 20, patientPx.y + dy)),
    };
  }

  const route = ambPx
    ? `M ${ambPx.x} ${ambPx.y} Q ${(ambPx.x + patientPx.x) / 2} ${(ambPx.y + patientPx.y) / 2 - 60} ${patientPx.x} ${patientPx.y}`
    : "";

  return (
    <div className="relative w-full h-[560px] overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="mapBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="hsl(210 50% 96%)" />
            <stop offset="1" stopColor="hsl(210 60% 92%)" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#mapBg)" />

        <rect x="20" y="80" width="100" height="80" rx="12" fill="hsl(152 45% 85%)" />
        <rect x="260" y="380" width="120" height="100" rx="12" fill="hsl(152 45% 85%)" />
        <rect x="160" y="40" width="60" height="50" rx="10" fill="hsl(210 30% 90%)" />
        <rect x="40" y="280" width="80" height="60" rx="10" fill="hsl(210 30% 90%)" />
        <rect x="280" y="200" width="100" height="70" rx="10" fill="hsl(210 30% 90%)" />

        <g stroke="white" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M -10 200 L 410 200" />
          <path d="M -10 380 L 410 380" />
          <path d="M 150 -10 L 150 570" />
          <path d="M 320 -10 L 320 570" />
        </g>

        {ambPx && (
          <>
            <path d={route} fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="12" strokeLinecap="round" />
            <path d={route} fill="none" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 8" />
          </>
        )}

        {/* Patient pin */}
        <g transform={`translate(${patientPx.x}, ${patientPx.y})`}>
          <circle r="22" fill="hsl(var(--primary) / 0.18)" />
          <circle r="14" fill="hsl(var(--primary))" />
          <circle r="5" fill="white" />
        </g>

        {ambPx && (
          <g transform={`translate(${ambPx.x}, ${ambPx.y})`}>
            <circle r="18" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text textAnchor="middle" y="5" fontSize="16">🚑</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default LiveMap;
