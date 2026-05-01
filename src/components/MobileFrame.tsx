import { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center md:p-6">
      <div className="max-w-md w-full mx-auto min-h-screen md:min-h-[860px] md:h-[860px] md:rounded-[2.5rem] md:border md:border-border flex flex-col bg-slate-50 shadow-2xl overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
