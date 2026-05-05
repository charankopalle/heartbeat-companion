import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLiveData } from "@/state/LiveDataContext";
import type { AppConfig } from "@/lib/config";

const Settings = ({ onBack }: { onBack: () => void }) => {
  const { t, i18n } = useTranslation();
  const { config, updateConfig, setLanguage } = useLiveData();
  const [c, setC] = useState<AppConfig>(config);

  const set = <K extends keyof AppConfig>(k: K, v: AppConfig[K]) => setC((p) => ({ ...p, [k]: v }));

  const save = () => {
    updateConfig(c);
    toast.success(t("settings.saved"));
  };

  return (
    <div className="px-5 pt-14 pb-10 space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="h-10 w-10 rounded-full bg-card border border-border grid place-items-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-display text-xl font-bold">{t("settings.title")}</h2>
      </header>

      <Group title={t("settings.language")}>
        <select value={i18n.language?.slice(0, 2) || "en"}
          onChange={(e) => setLanguage(e.target.value as any)} className={inputCls}>
          <option value="en">English</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="hi">हिन्दी (Hindi)</option>
        </select>
      </Group>

      <Group title={t("settings.backend")}>
        <Field label={t("settings.httpBaseUrl")}>
          <input value={c.httpBaseUrl} onChange={(e) => set("httpBaseUrl", e.target.value.trim())}
            placeholder="https://doctor-api.example.com" className={inputCls} />
        </Field>
        <Field label={t("settings.bearerToken")}>
          <input type="password" value={c.bearerToken} onChange={(e) => set("bearerToken", e.target.value)}
            className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("settings.registerPath")}>
            <input value={c.registerPath} onChange={(e) => set("registerPath", e.target.value)} className={inputCls} />
          </Field>
          <Field label={t("settings.alertPath")}>
            <input value={c.alertPath} onChange={(e) => set("alertPath", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Group>

      <Group title={t("settings.mqtt")}>
        <Field label={t("settings.mqttUrl")}>
          <input value={c.mqttUrl} onChange={(e) => set("mqttUrl", e.target.value.trim())}
            placeholder="wss://xxx.s1.eu.hivemq.cloud:8884/mqtt" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("settings.mqttUsername")}>
            <input value={c.mqttUsername} onChange={(e) => set("mqttUsername", e.target.value)} className={inputCls} />
          </Field>
          <Field label={t("settings.mqttPassword")}>
            <input type="password" value={c.mqttPassword} onChange={(e) => set("mqttPassword", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Group>

      <Group title={t("settings.topics")}>
        <Field label={t("settings.topicEcg")}>
          <input value={c.topicEcg} onChange={(e) => set("topicEcg", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t("settings.topicVitals")}>
          <input value={c.topicVitals} onChange={(e) => set("topicVitals", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t("settings.topicAlert")}>
          <input value={c.topicAlert} onChange={(e) => set("topicAlert", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t("settings.topicAmbulance")}>
          <input value={c.topicAmbulance} onChange={(e) => set("topicAmbulance", e.target.value)} className={inputCls} />
        </Field>
        <p className="text-[11px] text-muted-foreground">
          Use <code>{'{pid}'}</code> as the patient ID placeholder.
        </p>
      </Group>

      <Group title={t("settings.ble")}>
        <Field label={t("settings.deviceNamePrefix")}>
          <input value={c.bleDeviceNamePrefix} onChange={(e) => set("bleDeviceNamePrefix", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t("settings.serviceUuid")}>
          <input value={c.bleServiceUuid} onChange={(e) => set("bleServiceUuid", e.target.value.trim())} className={inputCls} />
        </Field>
        <Field label={t("settings.ecgCharUuid")}>
          <input value={c.bleEcgCharUuid} onChange={(e) => set("bleEcgCharUuid", e.target.value.trim())} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("settings.sampleRate")}>
            <input type="number" value={c.bleSampleRateHz}
              onChange={(e) => set("bleSampleRateHz", Number(e.target.value) || 250)} className={inputCls} />
          </Field>
          <Field label={t("settings.sampleFormat")}>
            <select value={c.bleSampleFormat} onChange={(e) => set("bleSampleFormat", e.target.value as any)} className={inputCls}>
              <option value="int16le">int16 LE</option>
              <option value="uint8">uint8</option>
              <option value="ascii">ASCII</option>
            </select>
          </Field>
        </div>
      </Group>

      <button onClick={save} className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold text-sm">
        {t("common.save")}
      </button>
    </div>
  );
};

const inputCls = "w-full h-10 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2.5">
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{title}</h3>
    <div className="space-y-3 rounded-2xl bg-card border border-border p-4">{children}</div>
  </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    {children}
  </label>
);

export default Settings;
