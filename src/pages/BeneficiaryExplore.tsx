import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { BarakahMapPin } from "@/components/BarakahMapPin";
import { useNima } from "@/context/NimaContext";
import type { Donation } from "@/context/NimaContext";
import { Filter, Search, Bell, Menu, Radio, MapPinned, Layers, Navigation, Info, Sparkles } from "lucide-react";
import { labelForCategory } from "@/lib/foodTaxonomy";
import { MINT, SLATE, shadowCard } from "@/lib/barakahDesign";
import { StepIndicator } from "@/components/StepIndicator";

/* Map bbox must match iframe */
const BBOX = { minLng: 51.41, maxLng: 51.58, minLat: 25.25, maxLat: 25.36 };
const MAP_BBOX = `${BBOX.minLng},${BBOX.minLat},${BBOX.maxLng},${BBOX.maxLat}`;

function pos(lat: number, lng: number) {
  return {
    left: `${((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100}%`,
    top: `${((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * 100}%`,
  };
}

/** Doha landmark coordinates (approx) */
const BLESSING_PINS = [
  { lat: 25.325, lng: 51.528, label: "West Bay" },
  { lat: 25.419, lng: 51.505, label: "Lusail" },
  { lat: 25.286, lng: 51.539, label: "Msheireb" },
  { lat: 25.35, lng: 51.475, label: "The Pearl" },
  { lat: 25.27, lng: 51.52, label: "Al Sadd" },
  { lat: 25.33, lng: 51.56, label: "Northeast" },
];

const USER = { lat: 25.3, lng: 51.5 };

function stableKm(id: string): string {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i) * (i + 3)) % 997;
  const v = ((n % 55) + 15) / 100;
  return v.toFixed(1);
}

export default function BeneficiaryExplore() {
  const navigate = useNavigate();
  const { donations } = useNima();

  const nearby = useMemo(
    () =>
      donations.filter((d) => d.status === "AVAILABLE" && d.expiresAt > Date.now()).slice(0, 8),
    [donations]
  );

  const fallbackPhoto =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=75&auto=format&fit=crop";

  const blessingCount = nearby.length >= 6 ? nearby.length : 6;

  return (
    <MobileFrame>
      <div className={`relative flex flex-1 flex-col min-h-0 bg-white ${BENEFICIARY_NAV_BOTTOM_PADDING}`}>
        {/* App bar */}
        <header className="relative z-30 flex items-center justify-between gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 bg-white/95 backdrop-blur-sm">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 text-slate-600"
            aria-label="Menu"
            onClick={() => navigate("/beneficiary/home")}
          >
            <Menu className="h-5 w-5" style={{ color: MINT }} />
          </button>
          <div className="flex flex-col items-center min-w-0">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 shrink-0" style={{ color: MINT }} />
              <span className="font-black text-base" style={{ color: SLATE }}>
                Barakah
              </span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#02db96]/90">Receiver</span>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" style={{ color: MINT }} />
          </button>
        </header>

        <div className="relative z-20 px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
              style={{ backgroundColor: MINT }}
            >
              2
            </span>
            <div>
              <h1 className="text-base font-bold leading-tight" style={{ color: SLATE }}>
                Step 2: Location Radar
              </h1>
              <p className="text-xs text-slate-500">Nearby Blessings ready to receive</p>
            </div>
          </div>
          <StepIndicator current={2} total={4} />
        </div>

        {/* Radar banner */}
        <div className="relative z-20 px-4 mb-2">
          <div
            className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 py-3"
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6faf4]">
              <Radio className="h-5 w-5 animate-pulse" style={{ color: MINT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">Move around to discover Blessings</p>
              <p className="text-xs text-slate-500">The closer you are, the stronger the signal.</p>
            </div>
            <button type="button" className="text-slate-400 p-1" aria-label="Info">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="relative flex-1 min-h-[320px] mx-4 mb-2 rounded-3xl overflow-hidden border border-gray-100 bg-slate-100">
          <iframe
            title="Doha map"
            className="absolute inset-0 h-full w-full border-0 grayscale-[5%]"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-white/30" />

          {/* User pulse */}
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={pos(USER.lat, USER.lng)}
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-sky-400/25 animate-pulse" />
              <div className="relative h-4 w-4 rounded-full bg-sky-500 ring-4 ring-white shadow-lg" />
            </div>
          </div>

          {BLESSING_PINS.map((p, i) => (
            <div
              key={i}
              className="pointer-events-none absolute z-[5] -translate-x-1/2 -translate-y-full drop-shadow-lg"
              style={pos(p.lat, p.lng)}
            >
              <BarakahMapPin />
            </div>
          ))}

          {/* FAB stack */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-2">
            {[MapPinned, Layers, Navigation].map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-100 text-slate-600"
                aria-label="Map control"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div className="relative z-20 px-4 pb-3">
          <div
            className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 py-3"
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-dashed border-[#02db96]/40 bg-[#e6faf4]">
              <Sparkles className="h-5 w-5" style={{ color: MINT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">{blessingCount} Blessings Nearby</p>
              <p className="text-xs text-slate-500">Move closer to increase signal strength</p>
            </div>
            <div className="flex items-end gap-0.5 h-8">
              {[0.45, 0.55, 0.75, 1].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-sm"
                  style={{ height: `${h * 100}%`, backgroundColor: MINT }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick strip */}
        <div className="relative z-20 px-4 pb-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Near you</p>
          <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
  const tag = donation.foodCategory ? labelForCategory(donation.foodCategory) : "Fresh meal";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl border border-gray-100 bg-white text-left ring-1 ring-gray-50 transition hover:ring-[#02db96]/30"
      style={{ boxShadow: shadowCard }}
    >
      <img src={photo} alt="" className="h-24 w-24 shrink-0 object-cover" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3">
        <p className="truncate font-bold text-slate-900">{donation.businessName}</p>
        <p className="text-xs text-slate-500">
          <span aria-hidden>📍</span> {km} km
        </p>
        <p className="text-[11px] font-medium" style={{ color: MINT }}>
          {tag} · Halal
        </p>
      </div>
    </button>
  );
}
