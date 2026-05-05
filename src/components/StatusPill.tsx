import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type Status = "normal" | "medium" | "high";

const config: Record<Status, { cls: string; dot: string; key: string }> = {
  normal: { cls: "bg-success-soft text-success", dot: "bg-success", key: "status.normal" },
  medium: { cls: "bg-warning-soft text-warning", dot: "bg-warning", key: "status.medium" },
  high:   { cls: "bg-destructive-soft text-destructive", dot: "bg-destructive", key: "status.high" },
};

const StatusPill = ({ status }: { status: Status }) => {
  const { t } = useTranslation();
  const c = config[status];
  return (
    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold", c.cls)}>
      <span className={cn("h-2 w-2 rounded-full animate-pulse", c.dot)} />
      {t(c.key)}
    </div>
  );
};

export default StatusPill;
