import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { useNima } from "@/context/NimaContext";
import type { Donation } from "@/context/NimaContext";
import { Filter, MapPin, Search } from "lucide-react";
import { labelForCategory } from "@/lib/foodTaxonomy";

const MINT = "#02db96";
const SUNSET = "#ffc02a";
const MAP_BBOX = "51.4391,25.2397,51.5569,25.3358"; /* Doha-ish */

function stableKm(id: string): string {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i) * (i + 3)) % 997;
  const v = ((n % 55) + 15) / 100;
  return v.toFixed(1);
}

const PIN_POSITIONS = [
  { top: "26%", left: "24%" },
  { top: "38%", left: "58%" },
  { top: "52%", left: "32%" },
  { top: "44%", left: "72%" },
];

export default function BeneficiaryExplore() {
  const navigate = useNavigate();
  const { donations } = useNima();

  const nearby = useMemo(
    () =>
      donations
        .filter((d) => d.status === "AVAILABLE" && d.expiresAt > Date.now())
        .slice(0, 8),
    [donations]
  );

  const fallbackPhoto =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=75&auto=format&fit=crop";

  return (
    <MobileFrame>
      <div
        className={`relative flex flex-1 flex-col min-h-0 bg-gray-100 ${BENEFICIARY_NAV_BOTTOM_PADDING}`}
      >
        {/* Map layer */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            title="Map of Doha, Qatar"
            className="h-full w-full border-0 grayscale-[15%] contrast-[1.02]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik`}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-gray-100/95"
            aria-hidden
          />
          {/* Fallback texture if iframe fails to paint */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
        </div>

        {/* Floating search */}
        <div className="relative z-20 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/8">
            <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
            <input
              type="search"
              readOnly
              placeholder="Search for meals or places"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none"
              onFocus={() => navigate("/beneficiary/home")}
            />
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#02db96]/10 text-[#02db96]"
              aria-label="Filters"
              onClick={() => navigate("/beneficiary/home")}
            >
              <Filter className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Map pins */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {PIN_POSITIONS.map((pos, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-full drop-shadow-lg"
              style={{ top: pos.top, left: pos.left }}
            >
              <MapPin
                className="h-9 w-9"
                fill={SUNSET}
                stroke="#b45309"
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* Quick view strip */}
        <div className="relative z-20 mt-auto w-full">
          <div className="px-4 pb-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Near you
            </p>
            <div className="-mx-1 flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(nearby.length ? nearby : mockCards()).map((d) => (
                <QuickCard
                  key={d.id}
                  donation={d}
                  km={stableKm(d.id)}
                  photo={d.photo || fallbackPhoto}
                  onOpen={() => navigate("/beneficiary/home")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <BeneficiaryBottomNav />
    </MobileFrame>
  );
}

function mockCards(): Donation[] {
  const now = Date.now();
  return [
    {
      id: "mock-explore-1",
      donorId: "mock",
      businessName: "Community Kitchen",
      businessType: "Non-profit",
      foodDescription: "Warm meals · today",
      quantity: "8 portions",
      pickupArea: "Al Sadd · Gate B",
      donorKind: "BUSINESS",
      expiresAt: now + 7200000,
      createdAt: now,
      status: "AVAILABLE",
      foodCategory: "PREPARED_HOT",
      photo:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=75&auto=format&fit=crop",
    },
  ];
}

function QuickCard({
  donation,
  km,
  photo,
  onOpen,
}: {
  donation: Donation;
  km: string;
  photo: string;
  onOpen: () => void;
}) {
  const tag = donation.foodCategory
    ? labelForCategory(donation.foodCategory)
    : "Fresh meal";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/80 bg-white text-left shadow-xl shadow-slate-900/10 ring-1 ring-gray-100 transition hover:ring-[#02db96]/40"
    >
      <img src={photo} alt="" className="h-24 w-24 shrink-0 object-cover" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3">
        <p className="truncate font-bold text-slate-900">{donation.businessName}</p>
        <p className="text-xs text-gray-500">
          <span aria-hidden>📍</span> {km} km
        </p>
        <p className="text-[11px] font-medium" style={{ color: MINT }}>
          {tag} · Halal
        </p>
      </div>
    </button>
  );
}
