import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { QrMock } from "@/components/QrMock";
import { beneficiaryPickupQrValue, useNima } from "@/context/NimaContext";
import { cn } from "@/lib/utils";
import { Clock, Store } from "lucide-react";

const MINT = "#02db96";
const SUNSET = "#ffc02a";

function expiresInMins(expiresAt: number): number {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 60000));
}

/** Pitch-deck history when user has no collected claims yet */
const DEMO_HISTORY = [
  { id: "demo-1", title: "West Bay Bakery Collective", subtitle: "Picked up · 3 days ago" },
  { id: "demo-2", title: "Ramadan Community Kitchen", subtitle: "Picked up · last week" },
];

export default function BeneficiaryActivity() {
  const navigate = useNavigate();
  const { beneficiary, claims, donations, myClaim, myActiveDonation } = useNima();
  const [tab, setTab] = useState<"active" | "history">("active");
  const [, tick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const claim = myClaim();
  const donation = myActiveDonation();

  const historyRows = useMemo(() => {
    const collected = claims.filter(
      (c) => c.beneficiaryId === beneficiary?.id && c.status === "COLLECTED"
    );
    const rows = collected
      .map((c) => {
        const d = donations.find((x) => x.id === c.donationId);
        return {
          id: c.id,
          title: d?.businessName ?? "Pickup",
          subtitle: `Picked up · ${formatRelative(c.createdAt)}`,
        };
      })
      .reverse();
    if (rows.length > 0) return rows;
    return DEMO_HISTORY;
  }, [claims, donations, beneficiary?.id]);

  const showDemoHistory = useMemo(
    () =>
      !claims.some((c) => c.beneficiaryId === beneficiary?.id && c.status === "COLLECTED"),
    [claims, beneficiary?.id]
  );

  const qrValue =
    beneficiary && claim
      ? beneficiaryPickupQrValue(beneficiary.id, claim.pinCode)
      : "BARAKAH-DEMO-PICKUP";

  const minsLeft = donation ? expiresInMins(donation.expiresAt) : 42;

  return (
    <MobileFrame>
      <div
        className={`flex flex-1 flex-col min-h-0 bg-[#F9FAFB] ${BENEFICIARY_NAV_BOTTOM_PADDING}`}
      >
        <header className="shrink-0 bg-white px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] shadow-sm shadow-slate-900/5">
          <h1 className="text-center text-xl font-bold tracking-tight text-slate-900">
            Your Activity
          </h1>
          <div className="mx-auto mt-4 flex max-w-xs rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setTab("active")}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors",
                tab === "active" ? "text-white shadow-md" : "text-gray-500"
              )}
              style={tab === "active" ? { backgroundColor: MINT } : undefined}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors",
                tab === "history" ? "text-white shadow-md" : "text-gray-500"
              )}
              style={tab === "history" ? { backgroundColor: MINT } : undefined}
            >
              History
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {tab === "active" ? (
            <>
              {claim && donation ? (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-gray-50">
                  <div
                    className="px-5 pb-2 pt-5 text-center"
                    style={{
                      background: `linear-gradient(145deg, ${MINT}12 0%, #892aff0f 100%)`,
                    }}
                  >
                    <div className="mb-3 flex items-center justify-center gap-2 text-slate-800">
                      <Store className="h-5 w-5 shrink-0" style={{ color: MINT }} />
                      <span className="font-bold">{donation.businessName}</span>
                    </div>
                    <div className="flex justify-center py-2">
                      <QrMock value={qrValue} size={180} />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Pickup PIN
                    </p>
                    <p
                      className="mt-1 font-mono text-5xl font-black tracking-[0.35em] text-slate-900"
                      style={{ letterSpacing: "0.25em" }}
                    >
                      {claim.pinCode}
                    </p>
                    <div
                      className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                      style={{
                        backgroundColor: `${SUNSET}22`,
                        color: "#b45309",
                      }}
                    >
                      <Clock className="h-4 w-4" aria-hidden />
                      expires in {minsLeft} mins
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-center text-sm font-medium text-slate-700">
                      {donation.foodDescription}
                    </p>
                    <p className="mt-1 text-center text-xs text-gray-500">{donation.pickupArea}</p>
                    <button
                      type="button"
                      onClick={() => navigate("/beneficiary/qr")}
                      className="mt-4 w-full rounded-2xl py-3 text-sm font-bold text-white shadow-md transition hover:opacity-95"
                      style={{ backgroundColor: MINT }}
                    >
                      Full pickup details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${MINT}18` }}
                  >
                    <Clock className="h-8 w-8" style={{ color: MINT }} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">No active reservation</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Claim a meal from the home feed to see your QR and PIN here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/beneficiary/home")}
                    className="mt-6 w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: MINT }}
                  >
                    Browse nearby meals
                  </button>
                  {/* Pitch snapshot: illustrative card */}
                  <div className="mt-10 border-t border-gray-100 pt-8">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Preview
                    </p>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 opacity-90">
                      <p className="text-xs font-semibold text-gray-500">Sample PIN</p>
                      <p className="font-mono text-3xl font-black tracking-widest text-slate-400">
                        4827
                      </p>
                      <p
                        className="mt-2 text-xs font-bold"
                        style={{ color: SUNSET }}
                      >
                        expires in 42 mins
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {showDemoHistory && (
                <p className="mb-2 text-center text-[11px] text-gray-400">
                  Example history for your deck — real pickups appear here automatically.
                </p>
              )}
              {historyRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/80 px-4 py-3.5 opacity-85 ring-1 ring-gray-50"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: MINT }}
                  >
                    ✓
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-700">{row.title}</p>
                    <p className="text-xs text-gray-400">{row.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Picked up
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BeneficiaryBottomNav />
    </MobileFrame>
  );
}

function formatRelative(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d} days ago`;
  return "recently";
}
