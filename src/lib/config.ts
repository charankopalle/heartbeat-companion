// Persisted runtime configuration for the CardioBand patient app.
// All endpoints, topics, BLE UUIDs and credentials live here so the app can be
// pointed at a real doctor backend without rebuilding.

export type Gender = "male" | "female" | "other";
export type RiskCategory = "low" | "moderate" | "high";

export interface PatientProfile {
  id: string;          // patientId used in MQTT topics & HTTP calls
  name: string;
  age: number | "";
  gender: Gender;
  bloodGroup: string;
  medicalHistory: string;   // free text / comma list
  riskCategory: RiskCategory;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface AppConfig {
  // ---- Patient ----
  patient: PatientProfile;

  // ---- Doctor backend ----
  httpBaseUrl: string;          // e.g. https://doctor-api.example.com
  registerPath: string;         // e.g. /patients
  alertPath: string;            // e.g. /alerts
  bearerToken: string;          // sent as Authorization: Bearer …

  // ---- MQTT ----
  mqttUrl: string;              // wss://xxx.s1.eu.hivemq.cloud:8884/mqtt
  mqttUsername: string;
  mqttPassword: string;
  topicEcg: string;             // {pid} -> patient.id
  topicVitals: string;
  topicAlert: string;
  topicAmbulance: string;

  // ---- BLE / ESP32 ----
  bleDeviceNamePrefix: string;  // "CardioBand"
  bleServiceUuid: string;
  bleEcgCharUuid: string;       // notify characteristic streaming ECG samples
  bleSampleRateHz: number;      // e.g. 250
  bleSampleFormat: "int16le" | "uint8" | "ascii"; // how to decode bytes

  // ---- Locale ----
  language: "en" | "te" | "hi";
}

const STORAGE_KEY = "cardioband.config.v1";

export const defaultConfig: AppConfig = {
  patient: {
    id: "",
    name: "",
    age: "",
    gender: "male",
    bloodGroup: "",
    medicalHistory: "",
    riskCategory: "low",
    emergencyContactName: "",
    emergencyContactPhone: "",
  },
  httpBaseUrl: "",
  registerPath: "/patients",
  alertPath: "/alerts",
  bearerToken: "",
  mqttUrl: "",
  mqttUsername: "",
  mqttPassword: "",
  topicEcg: "cardioband/{pid}/ecg",
  topicVitals: "cardioband/{pid}/vitals",
  topicAlert: "cardioband/{pid}/alert",
  topicAmbulance: "cardioband/{pid}/ambulance",
  bleDeviceNamePrefix: "CardioBand",
  bleServiceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  bleEcgCharUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
  bleSampleRateHz: 250,
  bleSampleFormat: "int16le",
  language: "en",
};

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(cfg: AppConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function topicFor(template: string, patientId: string): string {
  return template.replace("{pid}", patientId || "unknown");
}

export function isPatientReady(p: PatientProfile): boolean {
  return Boolean(p.id && p.name && p.age && p.emergencyContactPhone);
}
