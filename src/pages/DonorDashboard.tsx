import { Link, useNavigate } from "react-router-dom";
import { Plus, ScanLine, LogOut, Package, CheckCircle2, TrendingUp, User } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { DonationCard } from "@/components/DonationCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DonorAiBot } from "@/components/DonorAiBot";
import { useEffect, useState } from "react";

type ListTab = "active" | "history";

export default function DonorDashboard() {
  const { donor, donations, logout } = useNima();
  const navigate = useNavigate();
  const [, force] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listTab, setListTab] = useState<ListTab>("active");
  const [showMotivation, setShowMotivation] = useState(false);

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const key = "barakah-motivation-day";
    const today = new Date().toDateString();
    const last = sessionStorage.getItem(key);
    if (last !== today && Math.random() < 0.35) {
      sessionStorage.setItem(key, today);
      setShowMotivation(true);
    }
  }, []);

  const mine = donations.filter((d) => d.donorId === donor!.id);
  const activeList = mine.filter((d) => d.status === "AVAILABLE" || d.status === "CLAIMED");
  const historyList = mine
    .filter((d) => d.status === "COLLECTED" || d.status === "EXPIRED")
    .sort((a, b) => b.createdAt - a.createdAt);
  const collected = mine.filter((d) => d.status === "COLLECTED").length;
  const claimed = mine.filter((d) => d.status === "CLAIMED").length;
  const activeCount = activeList.length;

  return (
    <MobileFrame>
      <div className="bg-gradient-primary text-primary-foreground px-5 pt-7 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs opacity-80">Welcome back</p>
            <h1 className="text-2xl font-bold">{donor!.businessName}</h1>
            <p className="text-xs opacity-80">{donor!.businessType}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/donor/profile"
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active", val: activeCount, Icon: Package },
            { label: "Claimed", val: claimed, Icon: TrendingUp },
            { label: "Rescued", val: collected, Icon: CheckCircle2 },
          ].map(({ label, val, Icon }) => (
            <div key={label} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
              <Icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-[10px] uppercase tracking-wide opacity-80">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {showMotivation && (
        <div className="mx-5 -mt-3 relative z-10 rounded-2xl bg-secondary/90 text-secondary-foreground p-4 shadow-soft ring-1 ring-secondary/40">
          <p className="text-sm font-semibold leading-snug">
            195.9M people go hungry. Thank you for doing your part.
          </p>
          <button
            type="button"
            onClick={() => setShowMotivation(false)}
            className="mt-2 text-xs font-bold underline opacity-90"
          >
            Dismiss
          </button>
        </div>
      )}

      <DonorAiBot />

      <div className="px-5 -mt-1 mb-4 grid grid-cols-2 gap-3 relative z-10">
        <Link
          to="/donor/create"
          className="bg-card rounded-2xl p-4 shadow-soft ring-1 ring-black/[0.04] hover:shadow-elevated transition flex flex-col items-start gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">New donation</div>
            <div className="text-xs text-muted-foreground">Post surplus food</div>
          </div>
        </Link>
        <Link
          to="/donor/verify"
          className="bg-card rounded-2xl p-4 shadow-soft ring-1 ring-black/[0.04] hover:shadow-elevated transition flex flex-col items-start gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-trust flex items-center justify-center text-white">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">Verify pickup</div>
            <div className="text-xs text-muted-foreground">PIN or QR</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex rounded-xl bg-muted/60 p-1 mb-4">
          <button
            type="button"
            onClick={() => setListTab("active")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
              listTab === "active" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setListTab("history")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
              listTab === "history" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            History
          </button>
        </div>

        {listTab === "active" ? (
          <>
            <h2 className="font-bold text-foreground mb-3">Your active donations</h2>
            {activeList.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center shadow-soft border border-dashed border-border/70">
                <Package className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold mb-1">No active donations</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Post your first surplus item — it takes 20 seconds.
                </p>
                <Link
                  to="/donor/create"
                  className="inline-block bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-elevated"
                >
                  Add donation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
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
            <h2 className="font-bold text-foreground mb-3">Past donations</h2>
            {historyList.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed or expired items yet.</p>
            ) : (
              <div className="space-y-3">
                {historyList.map((d) => (
                  <DonationCard key={d.id} donation={d} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Sign out of this account?"
        description="You'll need your username and password to log back in. Active donations stay live for everyone on your team."
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
