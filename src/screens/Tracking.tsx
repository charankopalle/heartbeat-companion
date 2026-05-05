import { useTranslation } from "react-i18next";
import { ArrowLeft, Phone, Ambulance } from "lucide-react";
import LiveMap from "@/components/LiveMap";
import { useLiveData } from "@/state/LiveDataContext";

const Tracking = ({ onArrived, onBack }: { onArrived: () => void; onBack: () => void }) => {
  const { t } = useTranslation();
  const { ambulance } = useLiveData();
  const eta = ambulance?.etaMinutes;

  return (
    <div className="relative min-h-full bg-secondary">
      <LiveMap
        ambulanceLat={ambulance?.lat}
        ambulanceLng={ambulance?.lng}
        patientLat={ambulance?.patientLat}
        patientLng={ambulance?.patientLng}
      />

      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="h-11 w-11 rounded-full bg-card shadow-card grid place-items-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="px-4 py-2 rounded-full bg-card shadow-card">
          <p className="text-xs font-semibold text-success">● {t("tracking.onTheWay")}</p>
        </div>
        <div className="h-11 w-11" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-[2rem] shadow-floating p-5 pb-8 animate-slide-up">
        <div className="h-1.5 w-12 rounded-full bg-border mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("tracking.arrivingIn")}</p>
            <p className="font-display text-4xl font-bold tabular">
              {eta != null ? Math.ceil(eta) : "—"} <span className="text-base font-semibold text-muted-foreground">{t("tracking.min")}</span>
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center text-primary-foreground">
            <Ambulance className="h-7 w-7" />
          </div>
        </div>

        {ambulance?.driverName ? (
          <div className="rounded-2xl bg-secondary p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-card grid place-items-center font-bold text-primary">
                {ambulance.driverName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{ambulance.driverName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {[ambulance.vehicleNo, ambulance.hospitalName].filter(Boolean).join(" · ")}
                </p>
              </div>
              {ambulance.driverPhone && (
                <a href={`tel:${ambulance.driverPhone}`} aria-label="Call driver"
                  className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-3">{t("tracking.waitingDoctor")}</p>
        )}

        <button onClick={onArrived}
          className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm">
          {t("tracking.viewDetails")}
        </button>
      </div>
    </div>
  );
};

export default Tracking;
