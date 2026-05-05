import { useTranslation } from "react-i18next";
import { Phone, MapPin, Clock, Stethoscope, Ambulance, Building2, CheckCircle2 } from "lucide-react";
import { useLiveData } from "@/state/LiveDataContext";

const Row = ({ icon: Icon, title, sub, phone }: { icon: any; title: string; sub?: string; phone?: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
    <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-sm truncate">{title}</p>
      {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
    </div>
    {phone && (
      <a href={`tel:${phone}`} aria-label="Call"
        className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground">
        <Phone className="h-4 w-4" />
      </a>
    )}
  </div>
);

const AlertDetails = ({ onDone }: { onDone: () => void }) => {
  const { t } = useTranslation();
  const { ambulance } = useLiveData();

  if (!ambulance) {
    return (
      <div className="px-5 pt-14 pb-6 space-y-4">
        <h2 className="font-display text-2xl font-bold">{t("details.careAssigned")}</h2>
        <p className="text-sm text-muted-foreground">{t("details.waiting")}</p>
        <button onClick={onDone} className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm">
          {t("details.backToDashboard")}
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-success-soft text-success grid place-items-center">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-success font-semibold uppercase tracking-wider">{t("details.careAssigned")}</p>
          <h2 className="font-display text-2xl font-bold">{t("details.inGoodHands")}</h2>
        </div>
      </div>

      {ambulance.etaMinutes != null && (
        <div className="rounded-3xl gradient-primary text-primary-foreground p-5 shadow-floating">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 font-medium">{t("details.estArrival")}</p>
              <p className="font-display text-4xl font-bold tabular mt-1">{Math.ceil(ambulance.etaMinutes)} {t("tracking.min")}</p>
              {ambulance.distanceKm != null && (
                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {ambulance.distanceKm.toFixed(1)} km
                </p>
              )}
            </div>
            <Ambulance className="h-14 w-14 opacity-90" />
          </div>
        </div>
      )}

      <section className="space-y-2.5">
        {ambulance.hospitalName && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{t("details.hospital")}</h3>
            <Row icon={Building2} title={ambulance.hospitalName} />
          </>
        )}

        {ambulance.doctorName && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">{t("details.doctor")}</h3>
            <Row icon={Stethoscope} title={ambulance.doctorName} sub={ambulance.doctorPhone} phone={ambulance.doctorPhone} />
          </>
        )}

        {ambulance.driverName && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">{t("details.ambulance")}</h3>
            <Row icon={Ambulance} title={ambulance.driverName}
              sub={[ambulance.vehicleNo, ambulance.driverPhone].filter(Boolean).join(" · ")}
              phone={ambulance.driverPhone} />
          </>
        )}

        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 pt-2">{t("details.yourLocation")}</h3>
        <Row icon={MapPin}
          title={ambulance.patientLat != null ? `${ambulance.patientLat.toFixed(4)}, ${ambulance.patientLng?.toFixed(4)}` : t("details.sharedLive")}
          sub={t("details.sharedLive")} />
      </section>

      <div className="rounded-2xl bg-warning-soft border border-warning/20 p-4">
        <p className="text-xs font-bold text-warning uppercase tracking-wider">{t("details.whileYouWait")}</p>
        <p className="text-sm mt-1 leading-relaxed">{t("details.waitTip")}</p>
      </div>

      <button onClick={onDone} className="w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm">
        {t("details.backToDashboard")}
      </button>
    </div>
  );
};

export default AlertDetails;
