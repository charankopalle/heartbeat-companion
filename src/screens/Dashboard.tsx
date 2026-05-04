import { useEffect, useState } from "react";
import { ChevronRight, Heart, ShieldCheck, Wind } from "lucide-react";
import ECGWaveform from "@/components/ECGWaveform";
import BLEStatus from "@/components/BLEStatus";
import StatusPill, { Status } from "@/components/StatusPill";

const Dashboard = ({ onTriggerEmergency, onOpenProfile }: { onTriggerEmergency: () => void; onOpenProfile: () => void }) => {
  const [bpm, setBpm] = useState(78);
  const [status, setStatus] = useState<Status>("normal");
  const [spo2, setSpo2] = useState(98);
  const [hrv, setHrv] = useState(52);

  useEffect(() => {
    const id = setInterval(() => {
      setBpm((b) => Math.max(58, Math.min(120, b + Math.round((Math.random() - 0.5) * 4))));
      setSpo2((s) => Math.max(94, Math.min(100, s + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.3 ? 1 : 0))));
      setHrv((h) => Math.max(28, Math.min(80, h + Math.round((Math.random() - 0.5) * 3))));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setStatus(bpm > 110 ? "high" : bpm > 95 ? "medium" : "normal");
  }, [bpm]);

  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Good evening</p>
          <h2 className="font-display text-2xl font-bold tracking-tight">Aarav Mehta</h2>
        </div>
        <button onClick={onOpenProfile} className="h-11 w-11 rounded-full gradient-primary text-primary-foreground font-semibold shadow-card grid place-items-center">
          AM
        </button>
      </header>

      <BLEStatus connected />

      {/* Main heart card */}
      <section className="relative rounded-3xl bg-card border border-border shadow-card p-5 space-y-4 overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Heart Rate · Live</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-6xl font-bold tabular text-foreground">{bpm}</span>
              <span className="text-sm text-muted-foreground font-semibold">BPM</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Heart className="h-6 w-6 text-destructive fill-destructive animate-heart-beat" />
            <StatusPill status={status} />
          </div>
        </div>

        <ECGWaveform bpm={bpm} />

        <div className="grid grid-cols-3 gap-2 pt-1">
          <Metric icon={Wind} label="SpO₂" value={`${spo2}%`} />
          <Metric icon={Heart} label="HRV" value={`${hrv}ms`} />
          <Metric icon={ShieldCheck} label="Risk" value="Low" tone="success" />
        </div>
      </section>

      {/* SOS card */}
      <button
        onClick={onTriggerEmergency}
        className="w-full rounded-3xl gradient-emergency text-destructive-foreground p-5 text-left shadow-emergency active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs/relaxed opacity-90 font-medium">Need help now?</p>
            <p className="font-display text-xl font-bold mt-0.5">Trigger Emergency</p>
            <p className="text-xs opacity-90 mt-1">Doctor & ambulance dispatched instantly</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </button>

      {/* Tip */}
      <div className="rounded-2xl bg-primary-soft border border-primary/10 p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">AI Insight</p>
        <p className="text-sm text-foreground mt-1 leading-relaxed">
          Your rhythm has been stable for the last 4 hours. Consider a 10-minute breathing session before bed.
        </p>
      </div>
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

export default Dashboard;
