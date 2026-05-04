import { ArrowLeft, Heart, Pill, AlertCircle, Phone } from "lucide-react";

const Profile = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="h-10 w-10 rounded-full bg-card border border-border grid place-items-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-display text-xl font-bold">Patient Profile</h2>
      </header>

      <div className="rounded-3xl bg-card border border-border shadow-card p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl gradient-primary grid place-items-center text-primary-foreground font-display text-xl font-bold">
          AM
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-bold">Aarav Mehta</p>
          <p className="text-xs text-muted-foreground">34 yrs · Male · Blood O+</p>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-warning-soft text-warning text-[10px] font-bold uppercase tracking-wider">
            Risk: Moderate
          </span>
        </div>
      </div>

      <Section title="Medical history" icon={Heart}>
        <Tag>Hypertension</Tag>
        <Tag>Mild arrhythmia</Tag>
        <Tag>Family history of CAD</Tag>
      </Section>

      <Section title="Current medication" icon={Pill}>
        <Med name="Metoprolol" dose="25 mg · twice daily" />
        <Med name="Atorvastatin" dose="10 mg · at night" />
      </Section>

      <Section title="Allergies" icon={AlertCircle}>
        <Tag tone="warning">Penicillin</Tag>
        <Tag tone="warning">Sulfa drugs</Tag>
      </Section>

      <Section title="Emergency contact" icon={Phone}>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
          <div className="h-10 w-10 rounded-full bg-card grid place-items-center text-primary"><Phone className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Riya Mehta · Spouse</p>
            <p className="text-xs text-muted-foreground tabular">+91 98765 43210</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, icon: Icon, children }: any) => (
  <section className="space-y-2">
    <div className="flex items-center gap-2 px-1">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
    </div>
    <div className="rounded-2xl bg-card border border-border p-3 flex flex-wrap gap-2">{children}</div>
  </section>
);

const Tag = ({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "warning" }) => (
  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${tone === "warning" ? "bg-warning-soft text-warning" : "bg-primary-soft text-primary"}`}>
    {children}
  </span>
);

const Med = ({ name, dose }: { name: string; dose: string }) => (
  <div className="w-full flex items-center justify-between py-1">
    <p className="text-sm font-semibold">{name}</p>
    <p className="text-xs text-muted-foreground">{dose}</p>
  </div>
);

export default Profile;
