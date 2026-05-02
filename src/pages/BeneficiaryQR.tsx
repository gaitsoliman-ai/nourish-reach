import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { beneficiaryPickupQrValue, useNima } from "@/context/NimaContext";
import { StepIndicator } from "@/components/StepIndicator";
import { ArrowLeft, ShieldCheck, ScanLine, Store } from "lucide-react";
import { timeLeft } from "@/lib/time";
import { GoogleMapView, googleDirectionsLink, googleMapsLink } from "@/components/MapPicker";
import { MINT, SLATE, SOFT_MINT, shadowCard } from "@/lib/barakahDesign";

/** High-contrast QR placeholder grid */
function QrPlaceholder({ size = 220 }: { size?: number }) {
  const cells = 29;
  const pattern = (r: number, c: number) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= cells - 7) return true;
    if (r >= cells - 7 && c < 7) return true;
    return (r * 17 + c * 31) % 3 === 0 || (r + c * 7) % 5 === 0;
  };
  const cell = size / cells;
  return (
    <div
      className="relative mx-auto bg-white"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-3 grid gap-0 bg-white"
        style={{
          gridTemplateColumns: `repeat(${cells}, 1fr)`,
          gridTemplateRows: `repeat(${cells}, 1fr)`,
        }}
      >
        {Array.from({ length: cells * cells }).map((_, i) => {
          const r = Math.floor(i / cells);
          const c = i % cells;
          return (
            <div
              key={i}
              className={pattern(r, c) ? "bg-slate-900" : "bg-white"}
              style={{ minHeight: cell, minWidth: cell }}
            />
          );
        })}
      </div>
      {/* Corner brackets */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-8 w-8 border-l-[3px] border-t-[3px] rounded-tl-lg border-[#02db96]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-8 w-8 border-r-[3px] border-t-[3px] rounded-tr-lg border-[#02db96]" />
      <span className="pointer-events-none absolute -left-1 -bottom-1 h-8 w-8 border-l-[3px] border-b-[3px] rounded-bl-lg border-[#02db96]" />
      <span className="pointer-events-none absolute -right-1 -bottom-1 h-8 w-8 border-r-[3px] border-b-[3px] rounded-br-lg border-[#02db96]" />
    </div>
  );
}

export default function BeneficiaryQR() {
  const navigate = useNavigate();
  const { beneficiary, myClaim, myActiveDonation } = useNima();
  const claim = myClaim();
  const donation = myActiveDonation();

  if (!claim || !donation) {
    return (
      <MobileFrame>
        <div className={`flex flex-1 flex-col bg-[#fafafa] ${BENEFICIARY_NAV_BOTTOM_PADDING}`}>
          <header className="flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 bg-white border-b border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/beneficiary/home")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>
            <span className="font-bold text-slate-900">Your code</span>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: SOFT_MINT }}>
              <Store className="w-8 h-8" style={{ color: MINT }} />
            </div>
            <h2 className="font-bold text-lg mb-2" style={{ color: SLATE }}>
              No active claim
            </h2>
            <p className="text-sm text-slate-500 mb-6">Pick something from the list to get a pickup code.</p>
            <button
              onClick={() => navigate("/beneficiary/home")}
              className="font-bold px-8 py-3.5 rounded-3xl text-white shadow-lg"
              style={{ backgroundColor: MINT }}
            >
              Browse food
            </button>
          </div>
        </div>
        <BeneficiaryBottomNav />
      </MobileFrame>
    );
  }

  const t = timeLeft(donation.expiresAt);
  const qrPayload = beneficiaryPickupQrValue(beneficiary!.id, claim.pinCode);

  return (
    <MobileFrame>
      <div className={`flex flex-1 flex-col min-h-0 bg-[#fafafa] ${BENEFICIARY_NAV_BOTTOM_PADDING}`}>
        <header className="shrink-0 bg-white px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              type="button"
              onClick={() => navigate("/beneficiary/home")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: MINT }} />
            </button>
            <div className="text-center flex-1 pr-10">
              <p className="text-xs font-black tracking-wide" style={{ color: MINT }}>
                Barakah
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#02db96]/80">Receiver App</p>
            </div>
          </div>
          <StepIndicator current={3} total={3} />
          <p className="text-center text-[11px] font-bold uppercase tracking-wide mt-3 text-slate-500">
            Anonymous Claim
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex justify-center mb-6">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#e6faf4] shadow-inner">
              <div className="absolute inset-0 rounded-full opacity-40 blur-xl bg-[#02db96]/30" />
              <span className="text-5xl relative z-10" aria-hidden>
                🥡
              </span>
              <span className="absolute top-2 right-3 text-amber-400 text-lg">✦</span>
              <span className="absolute bottom-3 left-2 text-amber-400 text-sm">✦</span>
            </div>
          </div>

          <h1 className="text-center text-2xl font-black mb-2" style={{ color: SLATE }}>
            Your Blessing is Ready
          </h1>
          <p className="text-center text-sm text-slate-600 mb-8 max-w-xs mx-auto leading-relaxed">
            Show this QR code at the pickup location to receive your meal.
          </p>

          <div
            className="rounded-3xl bg-white p-6 mx-auto max-w-sm border border-gray-100"
            style={{ boxShadow: shadowCard }}
          >
            <QrPlaceholder size={220} />
            <p className="sr-only">Pickup QR payload encoded for scanners: {qrPayload}</p>
          </div>

          <div
            className="mt-6 rounded-3xl border border-[#02db96]/20 px-4 py-3 flex gap-3 items-start max-w-sm mx-auto"
            style={{ backgroundColor: SOFT_MINT }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShieldCheck className="h-5 w-5" style={{ color: MINT }} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm" style={{ color: SLATE }}>
                Private & Secure
              </p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                This QR code is anonymous and cannot be linked to your identity.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white border border-gray-100 p-5 max-w-sm mx-auto" style={{ boxShadow: shadowCard }}>
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-5 h-5" style={{ color: MINT }} />
              <div className="min-w-0">
                <p className="font-bold truncate text-slate-900">{donation.businessName}</p>
                <p className="text-xs text-slate-500">{donation.businessType}</p>
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1 text-center">Or share this PIN</p>
            <p className="text-center text-5xl font-black tracking-[0.35em] text-slate-900">{claim.pinCode}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-gray-100 pt-4">
              <span>{donation.pickupArea}</span>
              <span className={`font-semibold ${t.urgent ? "text-orange-600" : ""}`}>⏱ {t.label}</span>
            </div>
          </div>

          {donation.location && (
            <div className="mt-5 rounded-3xl overflow-hidden border border-gray-100 bg-white max-w-sm mx-auto shadow-sm">
              <GoogleMapView point={donation.location} height={180} />
              <div className="flex gap-2 p-3">
                <a
                  href={googleMapsLink(donation.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center text-sm font-semibold py-3 rounded-2xl bg-[#e6faf4] text-[#0A4D3C]"
                >
                  Open in Maps
                </a>
                <a
                  href={googleDirectionsLink(donation.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center text-sm font-semibold py-3 rounded-2xl bg-orange-50 text-orange-800 inline-flex items-center justify-center gap-1"
                >
                  Directions
                </a>
              </div>
            </div>
          )}

          <button
            type="button"
            className="mt-8 w-full max-w-sm mx-auto flex items-center justify-center gap-2 font-bold text-white py-4 rounded-3xl shadow-lg"
            style={{ backgroundColor: MINT }}
          >
            <ScanLine className="w-5 h-5" /> I&apos;m Here, Scan My Code
          </button>
        </div>
      </div>
      <BeneficiaryBottomNav />
    </MobileFrame>
  );
}
