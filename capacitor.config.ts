import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.e524e744a8a74948b405826c2ed3326e",
  appName: "CardioBand AI",
  webDir: "dist",
  server: {
    url: "https://e524e744-a8a7-4948-b405-826c2ed3326e.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for CardioBand…",
        cancel: "Cancel",
        availableDevices: "Available devices",
        noDeviceFound: "No CardioBand found",
      },
    },
  },
};

export default config;
