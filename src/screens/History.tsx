import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Activity, AlertTriangle } from "lucide-react";
import { loadHistory, type HistoryEvent } from "@/lib/history";

const tone = {
  normal: "bg-success-soft text-success",
  medium: "bg-warning-soft text-warning",
  high: "bg-destructive-soft text-destructive",
};

const HistoryScreen = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    setEvents(loadHistory());
    const id = setInterval(() => setEvents(loadHistory()), 4000);
    return () => clearInterval(id);
  }, []);

  const alerts = events.filter((e) => e.level !== "normal").length;
  const bpms = events.map((e) => e.bpm).filter((b): b is number => b != null && b > 0);
  const avg = bpms.length ? Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length) : null;

  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header>
        <p className="text-xs text-muted-foreground">{t("history.overview")}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight">{t("history.title")}</h2>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <Stat label={t("history.avgBpm")} value={avg?.toString() ?? "—"} />
        <Stat label={t("history.alerts")} value={alerts.toString()} tone="warning" />
        <Stat label={t("history.uptime")} value={events.length ? `${events.length}` : "—"} tone="success" />
      </div>

      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t("history.recent")}</h3>
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 rounded-2xl bg-card border border-border">{t("history.empty")}</p>
        )}
        {events.map((a) => (
          <div key={a.id}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border text-left">
            <div className={`h-11 w-11 rounded-xl grid place-items-center ${tone[a.level]}`}>
              {a.level === "normal" ? <Activity className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(a.ts).toLocaleString()} {a.bpm ? `· ${a.bpm} BPM` : ""}
              </p>
            </div>
          </div>
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
