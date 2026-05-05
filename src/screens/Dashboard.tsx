import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Heart, ShieldCheck, Wind, Settings as SettingsIcon, Wifi, WifiOff } from "lucide-react";
import ECGWaveform from "@/components/ECGWaveform";
import BLEStatus from "@/components/BLEStatus";
import StatusPill from "@/components/StatusPill";
import { useLiveData } from "@/state/LiveDataContext";

const Dashboard = ({
  onTriggerEmergency, onOpenProfile, onOpenSettings,
}: { onTriggerEmergency: () => void; onOpenProfile: () => void; onOpenSettings: () => void }) => {
  const { t } = useTranslation();
  const {
    config, ecgBuffer, bpm, status, bleStatus, connectBle, disconnectBle,
    mqttStatus, triggerEmergency,
  } = useLiveData();

  // session uptime / "spo2 / hrv" placeholders (not faked — only shown if ECG present)
  const [sessionMs, setSessionMs] = useState(0);
  useEffect(() => {
    if (bleStatus !== "connected") { setSessionMs(0); return; }
    const start = Date.now();
    const id = setInterval(() => setSessionMs(Date.now() - start), 1000);
    return () => clearInterval(id);
  }, [bleStatus]);

  const initials = (config.patient.name || "??").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const mqttOn = mqttStatus === "connected";

  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("dashboard.greeting")}</p>
          <h2 className="font-display text-2xl font-bold tracking-tight">{config.patient.name || "—"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenSettings} aria-label="Settings"
            className="h-10 w-10 rounded-full bg-card border border-border grid place-items-center">
            <SettingsIcon className="h-4 w-4" />
          </button>
          <button onClick={onOpenProfile}
            className="h-11 w-11 rounded-full gradient-primary text-primary-foreground font-semibold shadow-card grid place-items-center">
            {initials}
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        <BLEStatus
          status={bleStatus}
          onClick={() => (bleStatus === "connected" ? disconnectBle() : connectBle())}
        />
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          mqttOn ? "bg-success-soft text-success border-success/20" : "bg-card text-muted-foreground border-border"
        }`}>
          {mqttOn ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {mqttOn ? t("mqtt.connected") : mqttStatus === "connecting" ? t("mqtt.connecting") : t("mqtt.offline")}
        </div>
      </div>

      <section className="relative rounded-3xl bg-card border border-border shadow-card p-5 space-y-4 overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("dashboard.live")}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-6xl font-bold tabular text-foreground">{bpm ?? "—"}</span>
              <span className="text-sm text-muted-foreground font-semibold">{t("dashboard.bpm")}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Heart className={`h-6 w-6 text-destructive fill-destructive ${bpm ? "animate-heart-beat" : "opacity-30"}`} />
            <StatusPill status={status} />
          </div>
        </div>

        <ECGWaveform samples={ecgBuffer} />

        <div className="grid grid-cols-3 gap-2 pt-1">
          <Metric icon={Wind} label={t("dashboard.spo2")} value={bpm ? "—" : "—"} />
          <Metric icon={Heart} label="Session" value={fmtSession(sessionMs)} />
          <Metric icon={ShieldCheck} label={t("dashboard.risk")}
            value={config.patient.riskCategory.toUpperCase()}
            tone={config.patient.riskCategory === "low" ? "success" : "primary"} />
        </div>

        {status === "high" && (
          <div className="rounded-2xl bg-destructive-soft text-destructive border border-destructive/20 p-3 text-xs font-semibold">
            {t("dashboard.abnormalDetected")}
          </div>
        )}
      </section>

      <button
        onClick={() => { void triggerEmergency(true); onTriggerEmergency(); }}
        className="w-full rounded-3xl gradient-emergency text-destructive-foreground p-5 text-left shadow-emergency active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs/relaxed opacity-90 font-medium">{t("dashboard.needHelp")}</p>
            <p className="font-display text-xl font-bold mt-0.5">{t("dashboard.trigger")}</p>
            <p className="text-xs opacity-90 mt-1">{t("dashboard.triggerSub")}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </button>
    </div>
  );
};

const Metric = ({
  icon: Icon, label, value, tone = "primary",
}: { icon: any; label: string; value: string; tone?: "primary" | "success" }) => (
  <div className="rounded-2xl bg-secondary p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className={`mt-1 font-display text-lg font-bold tabular ${tone === "success" ? "text-success" : "text-foreground"}`}>{value}</p>
  </div>
);

function fmtSession(ms: number) {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export default Dashboard;
