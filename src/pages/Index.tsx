import { useState } from "react";
import { Activity, AlertTriangle, MapPin, History, User } from "lucide-react";
import Dashboard from "@/screens/Dashboard";
import Emergency from "@/screens/Emergency";
import Tracking from "@/screens/Tracking";
import AlertDetails from "@/screens/AlertDetails";
import HistoryScreen from "@/screens/History";
import Profile from "@/screens/Profile";
import Onboarding from "@/screens/Onboarding";
import Settings from "@/screens/Settings";
import PhoneFrame from "@/components/PhoneFrame";
import BottomNav from "@/components/BottomNav";
import { useLiveData } from "@/state/LiveDataContext";
import { isPatientReady } from "@/lib/config";

export type Screen =
  | "dashboard" | "emergency" | "tracking" | "details"
  | "history" | "profile" | "settings" | "onboarding";

const Index = () => {
  const { config, triggerEmergency } = useLiveData();
  const initial: Screen = isPatientReady(config.patient) ? "dashboard" : "onboarding";
  const [screen, setScreen] = useState<Screen>(initial);

  const renderScreen = () => {
    switch (screen) {
      case "onboarding": return <Onboarding onDone={() => setScreen("dashboard")} />;
      case "dashboard":  return <Dashboard
        onTriggerEmergency={() => setScreen("emergency")}
        onOpenProfile={() => setScreen("profile")}
        onOpenSettings={() => setScreen("settings")} />;
      case "emergency":  return <Emergency onMatched={() => setScreen("tracking")} onCancel={() => setScreen("dashboard")} />;
      case "tracking":   return <Tracking onArrived={() => setScreen("details")} onBack={() => setScreen("dashboard")} />;
      case "details":    return <AlertDetails onDone={() => setScreen("dashboard")} />;
      case "history":    return <HistoryScreen />;
      case "profile":    return <Profile onBack={() => setScreen("dashboard")} onEdit={() => setScreen("onboarding")} />;
      case "settings":   return <Settings onBack={() => setScreen("dashboard")} />;
    }
  };

  const showNav = !["emergency", "tracking", "onboarding"].includes(screen);

  return (
    <main className="min-h-screen w-full gradient-calm flex items-center justify-center p-0 sm:p-6">
      <h1 className="sr-only">CardioBand AI — Real-time ECG monitoring & emergency response</h1>
      <PhoneFrame>
        <div key={screen} className="absolute inset-0 overflow-y-auto pb-24 animate-fade-in-up">
          {renderScreen()}
        </div>
        {showNav && (
          <BottomNav
            current={screen}
            onChange={(s) => {
              if (s === "emergency") { void triggerEmergency(true); }
              setScreen(s);
            }}
            items={[
              { id: "dashboard", labelKey: "nav.live", icon: Activity },
              { id: "history",   labelKey: "nav.history", icon: History },
              { id: "emergency", labelKey: "nav.sos", icon: AlertTriangle, accent: true },
              { id: "details",   labelKey: "nav.care", icon: MapPin },
              { id: "profile",   labelKey: "nav.profile", icon: User },
            ]}
          />
        )}
      </PhoneFrame>
    </main>
  );
};

export default Index;
