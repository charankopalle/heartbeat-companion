import { useEffect, useState } from "react";
import { ArrowLeft, Phone, MessageCircle, Ambulance } from "lucide-react";
import LiveMap from "@/components/LiveMap";

const Tracking = ({ onArrived, onBack }: { onArrived: () => void; onBack: () => void }) => {
  const [eta, setEta] = useState(8);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(1, p + 0.02);
        return np;
      });
      setEta((e) => Math.max(1, e - 0.15));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-full bg-secondary">
      <LiveMap progress={progress} />

      {/* Top bar */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="h-11 w-11 rounded-full bg-card shadow-card grid place-items-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="px-4 py-2 rounded-full bg-card shadow-card">
          <p className="text-xs font-semibold text-success">● Help is on the way</p>
        </div>
        <div className="h-11 w-11" />
      </div>

      {/* Bottom card */}
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[2rem] shadow-floating p-5 pb-8 animate-slide-up">
        <div className="h-1.5 w-12 rounded-full bg-border mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Ambulance arriving in</p>
            <p className="font-display text-4xl font-bold tabular">
              {Math.ceil(eta)} <span className="text-base font-semibold text-muted-foreground">min</span>
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center text-primary-foreground">
            <Ambulance className="h-7 w-7" />
          </div>
        </div>

        <div className="rounded-2xl bg-secondary p-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              alt="Driver"
              src="https://i.pravatar.cc/64?img=12"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Rakesh Kumar</p>
              <p className="text-xs text-muted-foreground">KA-05-AM-2247 · Apollo Ambulance</p>
            </div>
            <button aria-label="Message" className="h-10 w-10 rounded-full bg-card grid place-items-center border border-border">
              <MessageCircle className="h-4 w-4 text-primary" />
            </button>
            <button aria-label="Call" className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground">
              <Phone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
          <div className="h-full gradient-primary transition-all" style={{ width: `${progress * 100}%` }} />
        </div>

        <button
          onClick={onArrived}
          className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm"
        >
          View care details
        </button>
      </div>
    </div>
  );
};

export default Tracking;
