import { ReactNode } from "react";

const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full max-w-[420px] h-[100vh] sm:h-[860px] sm:rounded-[3rem] bg-background sm:shadow-floating sm:border sm:border-border overflow-hidden">
      {/* Notch (only on desktop frame) */}
      <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 z-50 h-7 w-32 bg-foreground rounded-full items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 mr-2" />
        <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
      </div>
      {children}
    </div>
  );
};

export default PhoneFrame;
