import { useState } from "react";
import { Activity, AlertTriangle, MapPin, History, User } from "lucide-react";
import Dashboard from "@/screens/Dashboard";
import Emergency from "@/screens/Emergency";
import Tracking from "@/screens/Tracking";
import AlertDetails from "@/screens/AlertDetails";
import HistoryScreen from "@/screens/History";
import Profile from "@/screens/Profile";
import PhoneFrame from "@/components/PhoneFrame";
import BottomNav from "@/components/BottomNav";

export type Screen = "dashboard" | "emergency" | "tracking" | "details" | "history" | "profile";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const renderScreen = () => {
    switch (screen) {
      case "dashboard": return <Dashboard onTriggerEmergency={() => setScreen("emergency")} onOpenProfile={() => setScreen("profile")} />;
      case "emergency": return <Emergency onMatched={() => setScreen("tracking")} onCancel={() => setScreen("dashboard")} />;
      case "tracking": return <Tracking onArrived={() => setScreen("details")} onBack={() => setScreen("dashboard")} />;
      case "details": return <AlertDetails onDone={() => setScreen("dashboard")} />;
      case "history": return <HistoryScreen />;
      case "profile": return <Profile onBack={() => setScreen("dashboard")} />;
    }
  };

  const showNav = screen !== "emergency" && screen !== "tracking";

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
            onChange={setScreen}
            items={[
              { id: "dashboard", label: "Live", icon: Activity },
              { id: "history", label: "History", icon: History },
              { id: "emergency", label: "SOS", icon: AlertTriangle, accent: true },
              { id: "details", label: "Care", icon: MapPin },
              { id: "profile", label: "Profile", icon: User },
            ]}
          />
        )}
      </PhoneFrame>
    </main>
  );
};

export default Index;
