import { cn } from "@/lib/utils";

export type Status = "normal" | "medium" | "high";

const config: Record<Status, { label: string; cls: string; dot: string }> = {
  normal: { label: "Normal Rhythm", cls: "bg-success-soft text-success", dot: "bg-success" },
  medium: { label: "Mild Irregularity", cls: "bg-warning-soft text-warning", dot: "bg-warning" },
  high:   { label: "High Alert", cls: "bg-destructive-soft text-destructive", dot: "bg-destructive" },
};

const StatusPill = ({ status }: { status: Status }) => {
  const c = config[status];
  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold", c.cls)}>
      <span className={cn("h-2 w-2 rounded-full animate-pulse", c.dot)} />
      {c.label}
    </div>
  );
};

export default StatusPill;
