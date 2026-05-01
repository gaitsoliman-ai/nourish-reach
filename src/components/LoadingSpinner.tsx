import { MobileFrame } from "@/components/MobileFrame";

export function LoadingSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
        <div
          className="h-12 w-12 rounded-full border-[3px] border-primary/25 border-t-primary animate-spin"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground text-center">{label}</p>
      </div>
    </MobileFrame>
  );
}
