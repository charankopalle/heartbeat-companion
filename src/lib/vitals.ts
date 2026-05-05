// Lightweight ECG analysis: BPM estimation via R-peak detection on a rolling
// buffer of samples, plus a simple abnormality classifier.

export type VitalStatus = "normal" | "medium" | "high";

export interface VitalsResult {
  bpm: number | null;
  status: VitalStatus;
  reason: string;
}

/**
 * Estimate BPM from raw ECG samples (centered around 0).
 * Uses adaptive threshold + refractory window. Crude but fine for a UI.
 */
export function estimateBpm(samples: number[], sampleRateHz: number): number | null {
  if (samples.length < sampleRateHz * 2) return null; // need ≥2s
  let max = -Infinity, min = Infinity;
  for (const s of samples) { if (s > max) max = s; if (s < min) min = s; }
  const threshold = min + (max - min) * 0.65;
  const refractory = Math.floor(sampleRateHz * 0.25); // 250 ms
  const peaks: number[] = [];
  for (let i = 1; i < samples.length - 1; i++) {
    if (samples[i] > threshold && samples[i] >= samples[i - 1] && samples[i] >= samples[i + 1]) {
      if (peaks.length === 0 || i - peaks[peaks.length - 1] > refractory) peaks.push(i);
    }
  }
  if (peaks.length < 2) return null;
  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) intervals.push(peaks[i] - peaks[i - 1]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = (sampleRateHz / avg) * 60;
  if (!isFinite(bpm) || bpm < 30 || bpm > 220) return null;
  return Math.round(bpm);
}

export function classify(bpm: number | null): VitalsResult {
  if (bpm == null) return { bpm: null, status: "normal", reason: "no-signal" };
  if (bpm >= 130) return { bpm, status: "high",   reason: "tachycardia" };
  if (bpm <= 45)  return { bpm, status: "high",   reason: "bradycardia" };
  if (bpm >= 110) return { bpm, status: "medium", reason: "elevated-hr" };
  if (bpm <= 55)  return { bpm, status: "medium", reason: "low-hr" };
  return { bpm, status: "normal", reason: "ok" };
}
