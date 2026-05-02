import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  ScanLine,
  Bell,
  Home,
  ShoppingBag,
  Leaf,
  User,
  MapPin,
  Heart,
  ChevronRight,
  Soup,
  LogOut,
} from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { DonationCard } from "@/components/DonationCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DonorAiBot } from "@/components/DonorAiBot";
import { useEffect, useState } from "react";
import { MINT, SLATE, SOFT_MINT, SOFT_PEACH, SUNSET, shadowCard } from "@/lib/barakahDesign";

type ListTab = "active" | "history";

const MAP_BBOX = "51.41,25.25,51.58,25.36";

export default function DonorDashboard() {
  const { donor, donations, logout } = useNima();
  const navigate = useNavigate();
  const [, force] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listTab, setListTab] = useState<ListTab>("active");

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const mine = donations.filter((d) => d.donorId === donor!.id);
  const activeList = mine.filter((d) => d.status === "AVAILABLE" || d.status === "CLAIMED");
  const historyList = mine
    .filter((d) => d.status === "COLLECTED" || d.status === "EXPIRED")
    .sort((a, b) => b.createdAt - a.createdAt);
  const collected = mine.filter((d) => d.status === "COLLECTED").length;
  const activeCount = mine.filter((d) => d.status === "AVAILABLE").length;
  const mealsRescued = collected * 5 + 10;
  const peopleFed = collected * 8 + (activeCount > 0 ? 16 : 8);

  const firstActive = activeList[0];

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 min-h-0 bg-[#fafafa]">
        {/* Header */}
        <header className="shrink-0 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 bg-white rounded-b-3xl shadow-sm" style={{ boxShadow: shadowCard }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl shrink-0"
                style={{ backgroundColor: SOFT_MINT }}
              >
                <Soup className="h-5 w-5" style={{ color: MINT }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: SLATE }}>
                  barakah <span className="font-normal opacity-80">DONOR</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-400 ring-2 ring-white" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <Link
                to="/donor/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: MINT, borderColor: `${MINT}88` }}
                aria-label="Profile"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold leading-snug" style={{ color: SLATE }}>
            Welcome back,
            <br />
            <span className="font-semibold text-slate-600">You&apos;re making a difference </span>
            <span className="text-rose-400">♡</span>
          </h1>

          <div
            className="mt-4 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600"
            style={{ backgroundColor: SOFT_MINT }}
          >
            <Leaf className="h-4 w-4" style={{ color: MINT }} />
            Step 3 of 3 · Live Dashboard
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-28">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div
              className="rounded-3xl p-4 text-center border border-white/80"
              style={{ backgroundColor: SOFT_MINT, boxShadow: shadowCard }}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Soup className="h-5 w-5" style={{ color: MINT }} />
              </div>
              <p className="text-2xl font-black tabular-nums" style={{ color: SLATE }}>
                {mealsRescued}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mt-1">Meals Rescued</p>
              <p className="text-[10px] font-semibold mt-2" style={{ color: MINT }}>
                Total Impact ↗
              </p>
            </div>
            <div
              className="rounded-3xl p-4 text-center border border-orange-100/80"
              style={{ backgroundColor: SOFT_PEACH, boxShadow: shadowCard }}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-2xl font-black tabular-nums" style={{ color: SLATE }}>
                {activeCount}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mt-1">Active Listings</p>
              <p className="text-[10px] font-semibold mt-2 text-orange-600 flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Currently Live
              </p>
            </div>
            <div
              className="rounded-3xl p-4 text-center border border-white/80"
              style={{ backgroundColor: SOFT_MINT, boxShadow: shadowCard }}
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Heart className="h-5 w-5 fill-none" style={{ color: MINT }} strokeWidth={2} />
              </div>
              <p className="text-2xl font-black tabular-nums" style={{ color: SLATE }}>
                {peopleFed}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600 mt-1">People Fed</p>
              <p className="text-[10px] font-semibold mt-2 text-slate-500">Estimated ↗</p>
            </div>
          </div>

          {/* Nearby Activity map */}
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold" style={{ color: SLATE }}>
                Nearby Activity
              </h2>
              <button type="button" className="text-xs font-bold" style={{ color: MINT }}>
                View all &gt;
              </button>
            </div>
            <div
              className="relative h-52 w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-100"
              style={{ boxShadow: shadowCard }}
            >
              <iframe
                title="Activity map"
                className="absolute inset-0 h-full w-full border-0 opacity-95 pointer-events-none"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
              {/* Center pulse */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div
                  className="absolute h-28 w-28 rounded-full opacity-40 animate-pulse"
                  style={{ backgroundColor: `${MINT}44` }}
                />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: MINT }}>
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              {/* Orange pins */}
              {[
                { t: "18%", l: "22%" },
                { t: "55%", l: "68%" },
                { t: "42%", l: "38%" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute z-[5] -translate-x-1/2 -translate-y-full drop-shadow-md"
                  style={{ top: p.t, left: p.l }}
                >
                  <MapPin className="h-8 w-8" fill={SUNSET} stroke="#c2410c" strokeWidth={1} />
                </div>
              ))}

              {firstActive && (
                <div className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl bg-white p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl shrink-0 overflow-hidden bg-orange-50 flex items-center justify-center">
                    <Soup className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-orange-600">New Listing</span>
                    <p className="font-bold truncate text-slate-900">Fresh Meals Available</p>
                    <p className="text-xs text-slate-500">0.4 km away · <span className="text-orange-600 font-semibold">Closes in 45 minutes</span></p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
              )}
            </div>
          </section>

          <DonorAiBot />

          <div id="listings" className="grid grid-cols-2 gap-3 mt-6 mb-4">
            <Link
              to="/donor/create"
              className="rounded-3xl p-4 border border-gray-100 bg-white hover:shadow-md transition flex flex-col items-start gap-2"
              style={{ boxShadow: shadowCard }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: MINT }}
              >
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900">New donation</div>
                <div className="text-xs text-slate-500">Post surplus food</div>
              </div>
            </Link>
            <Link
              to="/donor/verify"
              className="rounded-3xl p-4 border border-gray-100 bg-white hover:shadow-md transition flex flex-col items-start gap-2"
              style={{ boxShadow: shadowCard }}
            >
              <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900">Verify pickup</div>
                <div className="text-xs text-slate-500">PIN or QR</div>
              </div>
            </Link>
          </div>

          <div className="flex rounded-2xl bg-gray-100/80 p-1 mb-4">
            <button
              type="button"
              onClick={() => setListTab("active")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${
                listTab === "active" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setListTab("history")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${
                listTab === "history" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              History
            </button>
          </div>

          {listTab === "active" ? (
            <>
              <h2 className="font-bold mb-3" style={{ color: SLATE }}>
                Your active donations
              </h2>
              {activeList.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200" style={{ boxShadow: shadowCard }}>
                  <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold mb-1 text-slate-800">No active donations</p>
                  <p className="text-sm text-slate-500 mb-4">Post your first surplus item — it takes 20 seconds.</p>
                  <Link
                    to="/donor/create"
                    className="inline-block font-bold px-6 py-3 rounded-3xl text-white shadow-lg"
                    style={{ backgroundColor: MINT }}
                  >
                    Add donation
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {activeList.map((d) => (
                    <DonationCard
                      key={d.id}
                      donation={d}
                      onClaim={d.status === "CLAIMED" ? () => navigate("/donor/verify") : undefined}
                      ctaLabel={d.status === "CLAIMED" ? `Verify pickup · PIN ${d.pinCode}` : ""}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-bold mb-3" style={{ color: SLATE }}>
                Past donations
              </h2>
              {historyList.length === 0 ? (
                <p className="text-sm text-slate-500">No completed or expired items yet.</p>
              ) : (
                <div className="space-y-3 pb-4">
                  {historyList.map((d) => (
                    <DonationCard key={d.id} donation={d} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Donor bottom nav (visual match) */}
        <nav
          className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-end justify-around border-t border-gray-100 bg-white px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.06)]"
          aria-label="Donor navigation"
        >
          <NavDonor icon={Home} label="Dashboard" active onClick={() => navigate("/donor/dashboard")} />
          <NavDonor icon={ShoppingBag} label="Listings" onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })} />
          <Link
            to="/donor/create"
            className="flex flex-col items-center -mt-6 mb-1"
            aria-label="New listing"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
              style={{ backgroundColor: MINT }}
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-semibold mt-1" style={{ color: MINT }}>
              New Request
            </span>
          </Link>
          <NavDonor icon={Leaf} label="Impact" onClick={() => navigate("/donor/impact")} />
          <NavDonor icon={User} label="Profile" onClick={() => navigate("/donor/profile")} />
        </nav>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Sign out of this account?"
        description="You'll need your username and password to log back in."
        confirmLabel="Sign out"
        destructive
        onConfirm={() => {
          logout();
          navigate("/");
        }}
      />
    </MobileFrame>
  );
}

function NavDonor({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1 py-2 px-2 min-w-0">
      <Icon
        className="h-6 w-6"
        strokeWidth={active ? 2.25 : 1.75}
        style={{ color: active ? MINT : "#9ca3af" }}
      />
      <span
        className="text-[10px] font-medium truncate max-w-[64px]"
        style={{ color: active ? MINT : "#9ca3af" }}
      >
        {label}
      </span>
    </button>
  );
}
