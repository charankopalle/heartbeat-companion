import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Screen } from "@/pages/Index";

type Item = { id: Screen; labelKey: string; icon: LucideIcon; accent?: boolean };

const BottomNav = ({
  current, onChange, items,
}: { current: Screen; onChange: (s: Screen) => void; items: Item[] }) => {
  const { t } = useTranslation();
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 bg-background/85 backdrop-blur-xl border-t border-border">
      <ul className="flex items-end justify-between">
        {items.map((it) => {
          const Icon = it.icon;
          const active = current === it.id;
          if (it.accent) {
            return (
              <li key={it.id} className="-mt-8">
                <button onClick={() => onChange(it.id)} aria-label={t(it.labelKey)}
                  className="h-16 w-16 rounded-full gradient-emergency text-destructive-foreground shadow-emergency flex items-center justify-center active:scale-95 transition-transform">
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </button>
              </li>
            );
          }
          return (
            <li key={it.id}>
              <button onClick={() => onChange(it.id)}
                className={cn("flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                  active ? "text-primary" : "text-muted-foreground")}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t(it.labelKey)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
