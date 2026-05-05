import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { connectEsp32, type BleStatus } from "@/lib/ble";
import { connectMqtt, type AmbulancePayload, type MqttStatus } from "@/lib/mqttClient";
import { classify, estimateBpm, type VitalStatus } from "@/lib/vitals";
import { loadConfig, saveConfig, type AppConfig } from "@/lib/config";
import { pushHistory } from "@/lib/history";
import i18n from "@/lib/i18n";

interface LiveData {
  config: AppConfig;
  updateConfig: (patch: Partial<AppConfig>) => void;
  setLanguage: (lng: AppConfig["language"]) => void;

  // BLE
  bleStatus: BleStatus;
  bleError: string | null;
  ecgBuffer: number[];          // last ~6s
  connectBle: () => Promise<void>;
  disconnectBle: () => Promise<void>;

  // MQTT
  mqttStatus: MqttStatus;

  // Vitals
  bpm: number | null;
  status: VitalStatus;

  // Doctor-app-driven assignment
  ambulance: AmbulancePayload | null;

  // Alerts
  emergencyActive: boolean;
  triggerEmergency: (manual?: boolean) => Promise<void>;
  cancelEmergency: () => void;
}

const Ctx = createContext<LiveData | null>(null);

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
  const [bleStatus, setBleStatus] = useState<BleStatus>("idle");
  const [bleError, setBleError] = useState<string | null>(null);
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>("idle");
  const [ecgBuffer, setEcgBuffer] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [status, setStatus] = useState<VitalStatus>("normal");
  const [ambulance, setAmbulance] = useState<AmbulancePayload | null>(null);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const bleHandle = useRef<Awaited<ReturnType<typeof connectEsp32>> | null>(null);
  const mqttHandle = useRef<ReturnType<typeof connectMqtt>>(null);
  const lastAlertAt = useRef(0);
  const sampleBuffer = useRef<number[]>([]);

  // ----- Config -----
  const updateConfig = useCallback((patch: Partial<AppConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch, patient: { ...prev.patient, ...(patch.patient ?? {}) } };
      saveConfig(next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((lng: AppConfig["language"]) => {
    i18n.changeLanguage(lng);
    updateConfig({ language: lng });
  }, [updateConfig]);

  // ----- MQTT lifecycle (re-connect when broker config or patient id change) -----
  useEffect(() => {
    mqttHandle.current?.disconnect();
    mqttHandle.current = connectMqtt(config, setMqttStatus, (a) => {
      setAmbulance(a);
      if (a.status === "completed") setEmergencyActive(false);
    });
    return () => { mqttHandle.current?.disconnect(); mqttHandle.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.mqttUrl, config.mqttUsername, config.mqttPassword, config.patient.id, config.topicAmbulance]);

  // ----- BLE -----
  const connectBle = useCallback(async () => {
    setBleError(null);
    try {
      bleHandle.current = await connectEsp32(
        config,
        (samples) => {
          // append + cap to ~6 seconds for analysis & display
          const cap = config.bleSampleRateHz * 6;
          sampleBuffer.current = [...sampleBuffer.current, ...samples].slice(-cap);
          setEcgBuffer(sampleBuffer.current);
          mqttHandle.current?.publishEcg(samples);
        },
        (s, msg) => { setBleStatus(s); if (msg) setBleError(msg); },
      );
    } catch (e: any) {
      setBleStatus("error");
      setBleError(e?.message ?? String(e));
    }
  }, [config]);

  const disconnectBle = useCallback(async () => {
    await bleHandle.current?.disconnect();
    bleHandle.current = null;
    sampleBuffer.current = [];
    setEcgBuffer([]);
    setBpm(null);
    setStatus("normal");
  }, []);

  // ----- Periodic vitals analysis -----
  useEffect(() => {
    const id = setInterval(() => {
      if (sampleBuffer.current.length < config.bleSampleRateHz * 2) return;
      const newBpm = estimateBpm(sampleBuffer.current, config.bleSampleRateHz);
      const v = classify(newBpm);
      setBpm(v.bpm);
      setStatus(v.status);
      mqttHandle.current?.publishVitals({ bpm: v.bpm ?? 0, status: v.status });

      if (v.status === "high" && Date.now() - lastAlertAt.current > 60_000) {
        lastAlertAt.current = Date.now();
        // auto-trigger emergency on abnormality
        void triggerEmergency(false);
      }
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.bleSampleRateHz]);

  // ----- Emergency -----
  const triggerEmergency = useCallback(async (manual = true) => {
    setEmergencyActive(true);
    const payload = {
      type: manual ? "manual" : "auto",
      bpm: bpm ?? 0,
      ts: Date.now(),
      reason: manual ? "patient-triggered" : status,
    };
    mqttHandle.current?.publishAlert(payload);
    pushHistory({
      ts: payload.ts,
      type: "alert",
      title: manual ? "Manual SOS" : `Abnormality (${payload.reason})`,
      bpm: payload.bpm,
      level: status,
    });

    if (config.httpBaseUrl) {
      try {
        await fetch(`${config.httpBaseUrl.replace(/\/$/, "")}${config.alertPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(config.bearerToken ? { Authorization: `Bearer ${config.bearerToken}` } : {}),
          },
          body: JSON.stringify({ ...payload, patient: config.patient }),
        });
      } catch { /* offline-tolerant; MQTT alert still went out */ }
    }
  }, [bpm, status, config]);

  const cancelEmergency = useCallback(() => setEmergencyActive(false), []);

  const value = useMemo<LiveData>(() => ({
    config, updateConfig, setLanguage,
    bleStatus, bleError, ecgBuffer, connectBle, disconnectBle,
    mqttStatus, bpm, status, ambulance,
    emergencyActive, triggerEmergency, cancelEmergency,
  }), [config, updateConfig, setLanguage, bleStatus, bleError, ecgBuffer, connectBle, disconnectBle,
       mqttStatus, bpm, status, ambulance, emergencyActive, triggerEmergency, cancelEmergency]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLiveData(): LiveData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLiveData must be used within LiveDataProvider");
  return v;
}
