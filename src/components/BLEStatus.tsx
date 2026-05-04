import { Bluetooth, BluetoothConnected } from "lucide-react";

const BLEStatus = ({ connected }: { connected: boolean }) => {
  const Icon = connected ? BluetoothConnected : Bluetooth;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-card">
      <span className="relative flex h-2 w-2">
        {connected && <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-success" : "bg-muted-foreground"}`} />
      </span>
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-semibold tabular">
        {connected ? "CardioBand · Connected" : "Searching device…"}
      </span>
    </div>
  );
};

export default BLEStatus;
