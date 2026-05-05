import { Bluetooth, BluetoothConnected, BluetoothSearching } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BleStatus } from "@/lib/ble";

const BLEStatusBadge = ({ status, onClick }: { status: BleStatus; onClick?: () => void }) => {
  const { t } = useTranslation();
  const connected = status === "connected";
  const Icon = connected ? BluetoothConnected : status === "scanning" || status === "connecting" ? BluetoothSearching : Bluetooth;
  const label =
    connected ? t("ble.connected") :
    status === "scanning" ? t("ble.scanning") :
    status === "connecting" ? t("ble.connecting") :
    status === "error" ? t("ble.failed") :
    t("dashboard.connectDevice");

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-card"
    >
      <span className="relative flex h-2 w-2">
        {connected && <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-success" : status === "error" ? "bg-destructive" : "bg-muted-foreground"}`} />
      </span>
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-semibold tabular">{label}</span>
    </button>
  );
};

export default BLEStatusBadge;
