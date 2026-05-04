import { Phone, MapPin, Clock, Stethoscope, Ambulance, Building2, CheckCircle2 } from "lucide-react";

const Row = ({ icon: Icon, title, sub, action }: { icon: any; title: string; sub: string; action?: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
    <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{sub}</p>
    </div>
    {action && (
      <button className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground" aria-label={action}>
        <Phone className="h-4 w-4" />
      </button>
    )}
  </div>
);

const AlertDetails = ({ onDone }: { onDone: () => void }) => {
  return (
    <div className="px-5 pt-14 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-success-soft text-success grid place-items-center">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-success font-semibold uppercase tracking-wider">Care Assigned</p>
          <h2 className="font-display text-2xl font-bold">You're in good hands</h2>
        </div>
      </div>

      <div className="rounded-3xl gradient-primary text-primary-foreground p-5 shadow-floating">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80 font-medium">Estimated arrival</p>
            <p className="font-display text-4xl font-bold tabular mt-1">06:42</p>
            <p className="text-xs opacity-80 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> 6 min away · 2.1 km</p>
          </div>
          <Ambulance className="h-14 w-14 opacity-90" />
        </div>
      </div>

      <section className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Hospital</h3>
        <Row icon={Building2} title="Apollo Hospitals, Indiranagar" sub="ICU Bay #4 · 2.1 km away" />

        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">Cardiologist</h3>
        <Row icon={Stethoscope} title="Dr. Priya Nair, MD" sub="Sr. Cardiologist · 14 yrs exp" action="Call doctor" />

        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">Ambulance</h3>
        <Row icon={Ambulance} title="Rakesh Kumar" sub="KA-05-AM-2247 · ALS Unit" action="Call driver" />

        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">Your Location</h3>
        <Row icon={MapPin} title="78, 4th Cross, Koramangala" sub="Shared live with care team" />
      </section>

      <div className="rounded-2xl bg-warning-soft border border-warning/20 p-4">
        <p className="text-xs font-bold text-warning uppercase tracking-wider">While you wait</p>
        <p className="text-sm mt-1 leading-relaxed">Sit upright, loosen tight clothing, and breathe slowly. Don't drive or take medication unless prescribed.</p>
      </div>

      <button onClick={onDone} className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm">
        Back to dashboard
      </button>
    </div>
  );
};

export default AlertDetails;
