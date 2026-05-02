import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BODY_GRAY, MINT, SLATE } from "@/lib/barakahDesign";

type StepIndicatorProps = {
  current: number; // 1-based
  total: number;
  className?: string;
};

export function StepIndicator({ current, total, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between px-1", className)}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1;
        const complete = stepNum < current;
        const active = stepNum === current;
        return (
          <Fragment key={stepNum}>
            <div className="flex flex-col items-center z-[1]">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all border-2",
                  complete || active
                    ? "border-transparent text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-400"
                )}
                style={
                  complete || active ? { backgroundColor: MINT, boxShadow: active ? `0 4px 14px ${MINT}55` : undefined } : undefined
                }
              >
                {complete ? <Check className="h-4 w-4 stroke-[3]" strokeWidth={3} /> : stepNum}
              </div>
            </div>
            {stepNum < total && (
              <div
                className="h-1 flex-1 min-w-[12px] rounded-full -mx-1 self-start mt-[14px] z-0"
                style={{
                  backgroundColor: complete ? MINT : "#e5e7eb",
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export function StepHeader({
  step,
  total,
  title,
  subtitle,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: MINT }}>
        Step {step} of {total}
      </p>
      <h1 className="text-xl font-bold leading-tight" style={{ color: SLATE }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm max-w-sm mx-auto leading-relaxed" style={{ color: BODY_GRAY }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
