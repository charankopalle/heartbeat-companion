import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Languages } from "lucide-react";
import { useLiveData } from "@/state/LiveDataContext";
import type { PatientProfile } from "@/lib/config";

const Onboarding = ({ onDone }: { onDone: () => void }) => {
  const { t, i18n } = useTranslation();
  const { config, updateConfig, setLanguage } = useLiveData();
  const [p, setP] = useState<PatientProfile>(config.patient);

  const set = <K extends keyof PatientProfile>(k: K, v: PatientProfile[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  const valid = p.id && p.name && String(p.age).length > 0 && p.emergencyContactPhone;

  const submit = () => {
    if (!valid) return;
    updateConfig({ patient: p });
    onDone();
  };

  return (
    <div className="px-5 pt-14 pb-10 space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive fill-destructive" />
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">CardioBand AI</p>
          </div>
          <h2 className="font-display text-2xl font-bold mt-1">{t("onboarding.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("onboarding.subtitle")}</p>
        </div>
        <select
          value={i18n.language?.slice(0, 2) || "en"}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="h-9 rounded-xl border border-border bg-card px-2 text-sm"
          aria-label={t("onboarding.language")}
        >
          <option value="en">EN</option>
          <option value="te">తెలుగు</option>
          <option value="hi">हिन्दी</option>
        </select>
      </header>

      <Field label={t("onboarding.patientId")}>
        <input value={p.id} onChange={(e) => set("id", e.target.value.trim())}
          placeholder="P-1024" className={inputCls} />
      </Field>
      <Field label={t("onboarding.name")}>
        <input value={p.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("onboarding.age")}>
          <input type="number" value={p.age} onChange={(e) => set("age", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label={t("onboarding.gender")}>
          <select value={p.gender} onChange={(e) => set("gender", e.target.value as any)} className={inputCls}>
            <option value="male">{t("onboarding.male")}</option>
            <option value="female">{t("onboarding.female")}</option>
            <option value="other">{t("onboarding.other")}</option>
          </select>
        </Field>
      </div>
      <Field label={t("onboarding.bloodGroup")}>
        <input value={p.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} placeholder="O+" className={inputCls} />
      </Field>
      <Field label={t("onboarding.medicalHistory")}>
        <textarea value={p.medicalHistory} onChange={(e) => set("medicalHistory", e.target.value)}
          rows={3} className={inputCls + " resize-none"} placeholder="Hypertension, mild arrhythmia…" />
      </Field>
      <Field label={t("onboarding.riskCategory")}>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "moderate", "high"] as const).map((r) => (
            <button key={r} type="button" onClick={() => set("riskCategory", r)}
              className={`py-2 rounded-xl text-sm font-semibold border ${
                p.riskCategory === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
              }`}>
              {t(`onboarding.${r}`)}
            </button>
          ))}
        </div>
      </Field>

      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-2">
        {t("onboarding.emergencyContact")}
      </h3>
      <Field label={t("onboarding.contactName")}>
        <input value={p.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} className={inputCls} />
      </Field>
      <Field label={t("onboarding.contactPhone")}>
        <input value={p.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value)}
          placeholder="+91 …" className={inputCls} />
      </Field>

      <button
        onClick={submit}
        disabled={!valid}
        className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
      >
        {t("onboarding.continue")}
      </button>
      <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
        <Languages className="h-3 w-3" /> EN · తెలుగు · हिन्दी
      </p>
    </div>
  );
};

const inputCls = "w-full h-11 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
  </label>
);

export default Onboarding;
