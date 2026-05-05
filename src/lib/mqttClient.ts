// MQTT bridge between this patient app and the doctor app.
//
// Topics (templates in AppConfig, {pid} replaced with patient.id):
//   {topicEcg}        patient -> doctor   live ECG samples (publish, QoS 0)
//   {topicVitals}     patient -> doctor   bpm/spo2/status   (publish, QoS 0)
//   {topicAlert}      patient -> doctor   abnormality alert (publish, QoS 1, retained)
//   {topicAmbulance}  doctor  -> patient  ambulance assignment + live position
//                                        (subscribe, retained payload)

import mqtt, { type MqttClient } from "mqtt";
import { topicFor, type AppConfig } from "./config";

export interface AmbulancePayload {
  hospitalName?: string;
  doctorName?: string;
  doctorPhone?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNo?: string;
  etaMinutes?: number;
  distanceKm?: number;
  lat?: number;
  lng?: number;
  patientLat?: number;
  patientLng?: number;
  status?: "assigned" | "enroute" | "arrived" | "completed";
}

export type MqttStatus = "idle" | "connecting" | "connected" | "offline" | "error";

export interface MqttHandle {
  client: MqttClient;
  publishEcg: (samples: number[], ts?: number) => void;
  publishVitals: (v: { bpm: number; spo2?: number; status: string }) => void;
  publishAlert: (a: { type: string; bpm: number; ts: number; reason: string }) => void;
  disconnect: () => void;
}

export function connectMqtt(
  cfg: AppConfig,
  onStatus: (s: MqttStatus, msg?: string) => void,
  onAmbulance: (a: AmbulancePayload) => void,
): MqttHandle | null {
  if (!cfg.mqttUrl || !cfg.patient.id) return null;

  onStatus("connecting");
  const client = mqtt.connect(cfg.mqttUrl, {
    username: cfg.mqttUsername || undefined,
    password: cfg.mqttPassword || undefined,
    clean: true,
    reconnectPeriod: 3000,
    clientId: `cardioband-patient-${cfg.patient.id}-${Math.random().toString(16).slice(2, 8)}`,
  });

  const ambTopic = topicFor(cfg.topicAmbulance, cfg.patient.id);

  client.on("connect", () => {
    onStatus("connected");
    client.subscribe(ambTopic, { qos: 1 });
  });
  client.on("reconnect", () => onStatus("connecting"));
  client.on("offline",   () => onStatus("offline"));
  client.on("error",     (e) => onStatus("error", e.message));
  client.on("message", (topic, payload) => {
    if (topic !== ambTopic) return;
    try { onAmbulance(JSON.parse(payload.toString())); } catch { /* ignore */ }
  });

  return {
    client,
    publishEcg: (samples, ts = Date.now()) => {
      if (!client.connected) return;
      client.publish(
        topicFor(cfg.topicEcg, cfg.patient.id),
        JSON.stringify({ ts, hz: cfg.bleSampleRateHz, s: samples }),
        { qos: 0 },
      );
    },
    publishVitals: (v) => {
      if (!client.connected) return;
      client.publish(
        topicFor(cfg.topicVitals, cfg.patient.id),
        JSON.stringify({ ts: Date.now(), ...v }),
        { qos: 0 },
      );
    },
    publishAlert: (a) => {
      if (!client.connected) return;
      client.publish(
        topicFor(cfg.topicAlert, cfg.patient.id),
        JSON.stringify({ ...a, patientId: cfg.patient.id }),
        { qos: 1, retain: true },
      );
    },
    disconnect: () => { try { client.end(true); } catch { /* ignore */ } onStatus("idle"); },
  };
}
