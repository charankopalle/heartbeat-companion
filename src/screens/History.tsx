import { Activity, AlertTriangle, ChevronRight } from "lucide-react";

const alerts = [
  { date: "Today · 14:22", title: "Mild tachycardia", bpm: 112, level: "medium" as const },
  { date: "Yesterday · 09:10", title: "Normal sinus rhythm", bpm: 74, level: "normal" as const },
  { date: "May 1 · 22:40", title: "Atrial flutter detected", bpm: 138, level: "high" as const },
  { date: "Apr 28 · 07:30", title: "Resting baseline", bpm: 62, level: "normal" as const },
  { date: "Apr 26 · 18:15", title: "Bradycardia episode", bpm: 48, level: "medium" as const },
];

const tone = {
  normal: "bg-success-soft text-success",
  medium: "bg-warning-soft text-warning",
  high: "bg-destructive-soft text-destructive",
};

const HistoryScreen = () => {
  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground">7-day overview</p>
        <h2 className="font-display text-2xl font-bold tracking-tight">Heart history</h2>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Avg BPM" value="76" />
        <Stat label="Alerts" value="3" tone="warning" />
        <Stat label="Uptime" value="98%" tone="success" />
      </div>

      {/* Mini chart */}
      <div className="rounded-3xl bg-card border border-border p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">BPM trend</p>
        <svg viewBox="0 0 300 80" className="w-full h-20 mt-2">
          <defs>
            <linearGradient id="trend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
              <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 50 L40 40 L80 55 L120 28 L160 42 L200 22 L240 48 L300 35 L300 80 L0 80 Z" fill="url(#trend)" />
          <path d="M0 50 L40 40 L80 55 L120 28 L160 42 L200 22 L240 48 L300 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Recent events</h3>
        {alerts.map((a, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors text-left"
          >
            <div className={`h-11 w-11 rounded-xl grid place-items-center ${tone[a.level]}`}>
              {a.level === "normal" ? <Activity className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.date} · {a.bpm} BPM</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </section>
    </div>
  );
};

const Stat = ({ label, value, tone = "primary" }: { label: string; value: string; tone?: "primary" | "warning" | "success" }) => {
  const c = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="rounded-2xl bg-card border border-border p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-display text-2xl font-bold tabular mt-1 ${c}`}>{value}</p>
    </div>
  );
};

export default HistoryScreen;
