import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import type { Donation } from "@/context/NimaContext";
import { useLocale } from "@/context/LocaleContext";
import { i18n } from "@/lib/i18n";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { BeneficiaryBottomNav } from "@/components/BeneficiaryBottomNav";
import { BeneficiaryAiBot } from "@/components/BeneficiaryAiBot";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  Filter,
  Heart,
  MapPin,
  Menu,
  QrCode,
  Search,
  Sparkles,
  UtensilsCrossed,
  UserRound,
  Soup,
  ShoppingBasket,
  ChefHat,
} from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { SOFT_MINT, SLATE, shadowCard } from "@/lib/barakahDesign";
import { labelForCategory } from "@/lib/foodTaxonomy";

const MINT = "#02db96";
const MINT_TEXT = "#0A4D3C";
function BarakahStarLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="barakahStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={MINT} />
          <stop offset="100%" stopColor="#ffc02a" />
        </linearGradient>
      </defs>
      <path
        fill="url(#barakahStarGrad)"
        d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z"
      />
    </svg>
  );
}

function stableKm(id: string): string {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i) * (i + 3)) % 997;
  const v = (n % 55 + 15) / 100;
  return v.toFixed(1);
}

function mealsBadgeLabel(d: Donation): string {
  const m = d.quantity.match(/(\d+)/);
  if (m) return `${m[1]} meals left`;
  const short = d.quantity.length > 14 ? `${d.quantity.slice(0, 11)}…` : d.quantity;
  return short;
}

function donationMatchesQuery(d: Donation, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  const hay = [d.businessName, d.foodDescription, d.pickupArea, d.businessType]
    .join(" ")
    .toLowerCase();
  return hay.includes(s);
}

export default function BeneficiaryHome() {
  const navigate = useNavigate();
  const { donations, claimDonation, logout, myClaim, myActiveDonation, beneficiary } = useNima();
  const { t } = useLocale();
  const [, force] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const tick = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(tick);
  }, []);

  const active = myClaim();
  const activeDonation = myActiveDonation();
  const available = useMemo(
    () =>
      donations.filter((d) => d.status === "AVAILABLE" && d.expiresAt > Date.now()),
    [donations]
  );

  const filtered = useMemo(
    () => available.filter((d) => donationMatchesQuery(d, search)),
    [available, search]
  );

  const handleClaim = (id: string) => {
    if (active) {
      toast.error(t(i18n.error.activeClaim));
      return;
    }
    const c = claimDonation(id);
    if (c) {
      toast.success("Reserved! Show your PIN at pickup.");
      navigate("/beneficiary/qr");
    } else {
      toast.error("Sorry, no longer available.");
    }
  };

  const fallbackPhoto =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=75&auto=format&fit=crop";

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 min-h-0 bg-white text-[#0f172a] relative pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
        {/* --- Top app bar --- */}
        <header className="flex items-center justify-between gap-3 px-5 pt-6 pb-3 bg-white shrink-0 border-b border-gray-50">
          <div className="flex items-center gap-2 min-w-0">
            <BarakahStarLogo />
            <div className="flex flex-col min-w-0">
              <span className="font-black text-lg leading-tight" style={{ color: MINT_TEXT }}>
                Barakah
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#02db96]/90 truncate">
                Receiver App
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-1.5"
              title={beneficiary?.isVerified ? "Your profile is verified" : undefined}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                <UserRound className="h-5 w-5" aria-hidden />
              </div>
              {beneficiary?.isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#02db96]/10 px-1.5 sm:px-2 py-1 text-[10px] font-semibold text-[#02db96]">
                  <BadgeCheck className="h-3 w-3 shrink-0" aria-hidden />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" style={{ color: MINT }} />
            </button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="w-11 h-11 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,320px)] rounded-l-3xl border-l border-gray-100">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2 text-sm">
                <button
                  type="button"
                  className="w-full text-left py-3 px-3 rounded-xl hover:bg-gray-50 font-medium text-[#0f172a]"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/beneficiary/qr");
                  }}
                >
                  My pickup QR
                </button>
                <button
                  type="button"
                  className="w-full text-left py-3 px-3 rounded-xl hover:bg-gray-50 font-medium text-red-600"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                >
                  Exit anonymously
                </button>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 space-y-6">
          <div className="pt-2 pb-1">
            <p className="text-[11px] font-bold uppercase text-center mb-2 tracking-wide text-slate-500">
              Finding blessings near you
            </p>
            <StepIndicator current={1} total={4} />
          </div>

          {/* Smart Discovery */}
          <section
            className="rounded-3xl border border-gray-100 overflow-hidden"
            style={{ backgroundColor: SOFT_MINT, boxShadow: shadowCard }}
          >
            <div className="flex flex-row items-stretch gap-4 p-5">
              <div className="flex-1 min-w-0 text-left">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white mb-3"
                  style={{ backgroundColor: MINT }}
                >
                  Step 1
                </span>
                <h2 className="text-xl font-black leading-tight" style={{ color: SLATE }}>
                  Smart Discovery
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Find available blessed items near you.
                </p>
              </div>
              <div className="relative w-[120px] shrink-0 flex items-center justify-center" aria-hidden>
                <div className="absolute inset-0 rounded-full bg-[#02db96]/15 scale-110" />
                <MapPin className="relative z-10 h-14 w-14 drop-shadow-md" style={{ color: MINT }} strokeWidth={2} />
              </div>
            </div>
          </section>

          {/* Browse Categories */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black" style={{ color: SLATE }}>
                Browse Categories
              </h2>
              <button
                type="button"
                className="text-sm font-bold"
                style={{ color: MINT }}
                onClick={() => document.getElementById("nearby-meals")?.scrollIntoView({ behavior: "smooth" })}
              >
                See All
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Fresh Bakery",
                  desc: "Bread, pastries, and more.",
                  count: "120+ items available",
                  img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=75&auto=format&fit=crop",
                  Icon: Soup,
                },
                {
                  title: "Hot Meals",
                  desc: "Warm plates ready to eat.",
                  count: "85+ items available",
                  img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=75&auto=format&fit=crop",
                  Icon: ChefHat,
                },
                {
                  title: "Groceries",
                  desc: "Produce & pantry essentials.",
                  count: "64+ items available",
                  img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=75&auto=format&fit=crop",
                  Icon: ShoppingBasket,
                },
              ].map((row) => (
                <button
                  key={row.title}
                  type="button"
                  onClick={() => document.getElementById("nearby-meals")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full flex gap-3 items-center rounded-3xl border border-gray-100 bg-white p-3 text-left transition hover:border-[#02db96]/25 active:scale-[0.99]"
                  style={{ boxShadow: shadowCard }}
                >
                  <img src={row.img} alt="" className="h-[72px] w-[72px] rounded-2xl object-cover shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6faf4]">
                        <row.Icon className="h-4 w-4" style={{ color: MINT }} />
                      </span>
                      <span className="font-bold text-slate-900 truncate">{row.title}</span>
                    </div>
                    <p className="text-xs text-slate-500">{row.desc}</p>
                    <p className="text-[11px] font-bold mt-1" style={{ color: MINT }}>
                      {row.count}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          </section>

          {/* Community CTA */}
          <section
            className="rounded-3xl border border-gray-100 bg-white p-4 flex items-center gap-3"
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6faf4] shrink-0">
              <Heart className="h-6 w-6 fill-[#02db96]/20" style={{ color: MINT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 leading-snug">Share blessings. Strengthen communities.</p>
              <p className="text-xs text-slate-500 mt-1">Reduce waste with dignity-first rescue.</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 shrink-0" />
          </section>

          {/* --- Search --- */}
          <div className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-white shadow-sm px-4 py-2.5">
            <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for meals or places"
              className="flex-1 min-w-0 bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none"
            />
            <button
              type="button"
              className="shrink-0 p-2 rounded-full hover:bg-[#02db96]/10 transition"
              aria-label="Filters"
              onClick={() => toast.message("Filters are coming soon — try search for now.")}
            >
              <Filter className="w-5 h-5" style={{ color: MINT }} />
            </button>
          </div>

          {/* AI shortcut */}
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-3xl border border-dashed border-[#02db96]/35 bg-[#e6faf4]/50 py-3 text-sm font-bold text-[#0A4D3C]"
          >
            <Sparkles className="h-5 w-5" style={{ color: MINT }} />
            Ask AI what&apos;s nearby
          </button>

          {/* --- Active claim --- */}
          {active && activeDonation && (
            <button
              type="button"
              onClick={() => navigate("/beneficiary/qr")}
              className="w-full rounded-2xl border border-[#02db96]/30 bg-[#02db96]/5 p-4 text-left shadow-sm flex items-center gap-3 active:scale-[0.99] transition"
            >
              <div className="w-12 h-12 rounded-xl bg-[#02db96]/15 flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" style={{ color: MINT }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#02db96]">Active claim</p>
                <p className="font-bold text-slate-800 truncate">{activeDonation.businessName}</p>
                <p className="text-xs text-gray-500">Tap for QR · PIN {active.pinCode}</p>
              </div>
            </button>
          )}

          {/* --- Nearby meals --- */}
          <section id="nearby-meals" className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Nearby meals</h2>
              <button
                type="button"
                className="text-sm font-semibold hover:underline"
                style={{ color: MINT }}
                onClick={() => toast.message(`${filtered.length} listings near you`)}
              >
                See all
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-8 text-center">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="font-semibold text-slate-800 mb-1">
                  {available.length === 0
                    ? "Nothing available right now"
                    : "No results for this search"}
                </p>
                <p className="text-sm text-gray-500">
                  {available.length === 0 ? t(i18n.empty.beneficiary) : "Try another keyword or clear search."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((d) => (
                  <article
                    key={d.id}
                    className="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)] flex gap-3 items-stretch"
                  >
                    <img
                      src={d.photo || fallbackPhoto}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <p className="font-bold text-slate-900 leading-snug truncate">{d.businessName}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span aria-hidden>📍</span>
                        {stableKm(d.id)} km away · {d.pickupArea.split("·")[0]?.trim() || d.pickupArea}
                      </p>
                      <p className="text-[11px] font-medium" style={{ color: MINT }}>
                        {d.foodCategory ? `${labelForCategory(d.foodCategory)} • Halal` : "Fresh • Halal"}
                      </p>
                      <button
                        type="button"
                        disabled={!!active}
                        onClick={() => handleClaim(d.id)}
                        className="mt-2 w-full sm:w-auto self-start rounded-xl px-4 py-2 text-xs font-bold text-white disabled:opacity-45 disabled:cursor-not-allowed transition"
                        style={{ backgroundColor: MINT }}
                      >
                        {active ? "Finish active claim first" : "Claim"}
                      </button>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0 gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap"
                        style={{ backgroundColor: `${MINT}1a`, color: MINT }}
                      >
                        {mealsBadgeLabel(d)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <BeneficiaryBottomNav />

      <BeneficiaryAiBot open={aiOpen} onOpenChange={setAiOpen} hideFab />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Exit anonymously?"
        description={
          active
            ? "You have an active claim — leaving now will cancel it and free the meal for someone else."
            : "Your anonymous code will be cleared. You can always come back and get a new one."
        }
        confirmLabel="Exit"
        destructive
        onConfirm={() => {
          logout();
          navigate("/");
        }}
      />
    </MobileFrame>
  );
}
