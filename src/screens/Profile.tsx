import { useTranslation } from "react-i18next";
import { ArrowLeft, Heart, AlertCircle, Phone, Pencil } from "lucide-react";
import { useLiveData } from "@/state/LiveDataContext";

const Profile = ({ onBack, onEdit }: { onBack: () => void; onEdit: () => void }) => {
  const { t } = useTranslation();
  const { config } = useLiveData();
  const p = config.patient;
  const initials = (p.name || "??").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  const riskTone = p.riskCategory === "high" ? "bg-destructive-soft text-destructive"
    : p.riskCategory === "moderate" ? "bg-warning-soft text-warning"
    : "bg-success-soft text-success";

  return (
    <div className="px-5 pt-14 pb-6 space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="h-10 w-10 rounded-full bg-card border border-border grid place-items-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-display text-xl font-bold">{t("profile.title")}</h2>
        </div>
        <button onClick={onEdit}
          className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-card border border-border text-xs font-semibold">
          <Pencil className="h-3.5 w-3.5" /> {t("profile.edit")}
        </button>
      </header>

      <div className="rounded-3xl bg-card border border-border shadow-card p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl gradient-primary grid place-items-center text-primary-foreground font-display text-xl font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-bold truncate">{p.name || "—"}</p>
          <p className="text-xs text-muted-foreground">
            {[p.age && `${p.age} yrs`, p.gender, p.bloodGroup && `Blood ${p.bloodGroup}`].filter(Boolean).join(" · ") || "—"}
          </p>
          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${riskTone}`}>
            {t("profile.risk")}: {t(`onboarding.${p.riskCategory}`)}
          </span>
        </div>
      </div>

      <Section title={t("profile.history")} icon={Heart}>
        <p className="text-sm leading-relaxed">{p.medicalHistory || "—"}</p>
      </Section>

      <Section title={t("profile.emergencyContact")} icon={Phone}>
        {p.emergencyContactPhone ? (
          <a href={`tel:${p.emergencyContactPhone}`} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary">
            <div className="h-10 w-10 rounded-full bg-card grid place-items-center text-primary"><Phone className="h-4 w-4" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{p.emergencyContactName || "—"}</p>
              <p className="text-xs text-muted-foreground tabular">{p.emergencyContactPhone}</p>
            </div>
          </a>
        ) : <p className="text-sm text-muted-foreground">—</p>}
      </Section>

      <div className="rounded-2xl bg-primary-soft border border-primary/10 p-4 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
        <p className="text-xs text-primary leading-relaxed">
          Patient ID <strong>{p.id || "—"}</strong> — used for all topics & alerts sent to the doctor app.
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, icon: Icon, children }: any) => (
  <section className="space-y-2">
    <div className="flex items-center gap-2 px-1">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
    </div>
    <div className="rounded-2xl bg-card border border-border p-3">{children}</div>
  </section>
);

export default Profile;
