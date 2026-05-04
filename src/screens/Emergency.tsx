import { useEffect, useState } from "react";
import { AlertTriangle, X, Stethoscope, Ambulance, Building2 } from "lucide-react";

const steps = [
  { icon: AlertTriangle, label: "Abnormal rhythm detected", sub: "AI confidence 94%" },
  { icon: Stethoscope, label: "Notifying nearest cardiologist", sub: "Apollo · Indiranagar" },
  { icon: Ambulance, label: "Dispatching ambulance", sub: "ETA being calculated" },
  { icon: Building2, label: "Reserving hospital bay", sub: "ICU bed #4" },
];

const Emergency = ({ onMatched, onCancel }: { onMatched: () => void; onCancel: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= steps.length) {
      const t = setTimeout(onMatched, 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1400);
    return () => clearTimeout(t);
  }, [step, onMatched]);

  return (
    <div className="min-h-full flex flex-col bg-foreground text-primary-foreground px-6 pt-14 pb-8">
      <button onClick={onCancel} aria-label="Cancel" className="self-end h-9 w-9 rounded-full bg-white/10 grid place-items-center">
        <X className="h-5 w-5" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative h-32 w-32 grid place-items-center mb-8">
          <span className="absolute inset-0 rounded-full bg-destructive/40 animate-pulse-ring" />
          <span className="absolute inset-0 rounded-full bg-destructive/30 animate-pulse-ring" style={{ animationDelay: "0.6s" }} />
          <span className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" style={{ animationDelay: "1.2s" }} />
          <div className="relative h-24 w-24 rounded-full gradient-emergency grid place-items-center shadow-emergency">
            <AlertTriangle className="h-10 w-10" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">Emergency Triggered</p>
        <h2 className="font-display text-3xl font-bold mt-2">Searching for help…</h2>
        <p className="text-sm text-white/70 mt-2 max-w-xs">
          Stay calm. We are alerting the nearest doctor and ambulance with your live location.
        </p>

        <ul className="mt-8 w-full max-w-sm space-y-2.5">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            const Icon = s.icon;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                  done ? "bg-success/15 border-success/30" :
                  active ? "bg-white/10 border-white/20 animate-fade-in-up" :
                  "bg-white/5 border-white/5 opacity-50"
                }`}
              >
                <div className={`h-9 w-9 rounded-xl grid place-items-center ${done ? "bg-success text-success-foreground" : "bg-white/10"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.label}</p>
                  <p className="text-xs text-white/60 truncate">{s.sub}</p>
                </div>
                {active && <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />}
                {done && <span className="text-success text-xs font-bold">✓</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={onCancel}
        className="mt-6 w-full py-4 rounded-2xl bg-white/10 border border-white/10 font-semibold text-sm hover:bg-white/15 transition-colors"
      >
        I'm okay — Cancel request
      </button>
    </div>
  );
};

export default Emergency;
