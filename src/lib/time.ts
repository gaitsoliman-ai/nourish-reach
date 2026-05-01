export function timeLeft(expiresAt: number): { label: string; urgent: boolean; expired: boolean } {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return { label: "Expired", urgent: true, expired: true };
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return { label: `${mins} min left`, urgent: mins <= 20, expired: false };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return { label: `${h}h ${m}m left`, urgent: false, expired: false };
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
