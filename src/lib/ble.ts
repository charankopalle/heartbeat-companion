// BLE bridge to the ESP32 CardioBand device.
//
// Uses the @capacitor-community/bluetooth-le plugin which works in BOTH:
//   • the browser (Web Bluetooth — Chrome/Edge on Android & desktop)
//   • Capacitor native iOS/Android builds
//
// The ESP32 firmware should expose a GATT service whose ECG characteristic
// streams notifications. Each notification is decoded according to
// AppConfig.bleSampleFormat and pushed into the LiveData context.

import { BleClient, type BleDevice } from "@capacitor-community/bluetooth-le";
import type { AppConfig } from "./config";

export type BleStatus = "idle" | "scanning" | "connecting" | "connected" | "error";

export interface BleHandle {
  device: BleDevice;
  disconnect: () => Promise<void>;
}

export async function connectEsp32(
  cfg: AppConfig,
  onSamples: (samples: number[]) => void,
  onStatus: (s: BleStatus, message?: string) => void,
): Promise<BleHandle> {
  await BleClient.initialize({ androidNeverForLocation: true });

  onStatus("scanning");
  const device = await BleClient.requestDevice({
    services: [cfg.bleServiceUuid],
    namePrefix: cfg.bleDeviceNamePrefix || undefined,
  });

  onStatus("connecting");
  await BleClient.connect(device.deviceId, () => onStatus("idle", "disconnected"));

  await BleClient.startNotifications(
    device.deviceId,
    cfg.bleServiceUuid,
    cfg.bleEcgCharUuid,
    (value) => {
      const samples = decodeSamples(value, cfg.bleSampleFormat);
      if (samples.length) onSamples(samples);
    },
  );

  onStatus("connected");

  return {
    device,
    disconnect: async () => {
      try {
        await BleClient.stopNotifications(device.deviceId, cfg.bleServiceUuid, cfg.bleEcgCharUuid);
      } catch { /* ignore */ }
      try { await BleClient.disconnect(device.deviceId); } catch { /* ignore */ }
      onStatus("idle");
    },
  };
}

function decodeSamples(view: DataView, format: AppConfig["bleSampleFormat"]): number[] {
  const out: number[] = [];
  if (format === "int16le") {
    for (let i = 0; i + 1 < view.byteLength; i += 2) out.push(view.getInt16(i, true));
  } else if (format === "uint8") {
    for (let i = 0; i < view.byteLength; i++) out.push(view.getUint8(i) - 128);
  } else if (format === "ascii") {
    const text = new TextDecoder().decode(view.buffer);
    for (const tok of text.split(/[\s,;]+/)) {
      if (!tok) continue;
      const n = Number(tok);
      if (!Number.isNaN(n)) out.push(n);
    }
  }
  return out;
}
