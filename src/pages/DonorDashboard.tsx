import { Link, useNavigate } from "react-router-dom";
import { Plus, ScanLine, LogOut, Package, CheckCircle2, TrendingUp } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { DonationCard } from "@/components/DonationCard";
import { useEffect, useState } from "react";

export default function DonorDashboard() {
  const { donor, donations, logout } = useNima();
  const navigate = useNavigate();
  const [, force] = useState(0);

  useEffect(() => {
    if (!donor) navigate("/donor/onboarding");
  }, [donor, navigate]);

  // ticking for live timers
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  if (!donor) return null;

  const mine = donations.filter((d) => d.donorId === donor.id);
  const active = mine.filter((d) => d.status !== "COLLECTED");
  const collected = mine.filter((d) => d.status === "COLLECTED").length;
  const claimed = mine.filter((d) => d.status === "CLAIMED").length;

  return (
    <MobileFrame>
      <div className="bg-gradient-primary text-primary-foreground px-5 pt-7 pb-8 rounded-b-3xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs opacity-80">Welcome back</p>
            <h1 className="text-2xl font-bold">{donor.businessName}</h1>
            <p className="text-xs opacity-80">{donor.businessType}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active", val: active.length, Icon: Package },
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

      <div className="px-5 -mt-5 mb-4 grid grid-cols-2 gap-3 relative z-10">
        <Link
          to="/donor/create"
          className="bg-card border border-border rounded-2xl p-4 shadow-soft hover:shadow-elevated transition flex flex-col items-start gap-2"
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
          className="bg-card border border-border rounded-2xl p-4 shadow-soft hover:shadow-elevated transition flex flex-col items-start gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-trust flex items-center justify-center text-accent-foreground">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">Verify pickup</div>
            <div className="text-xs text-muted-foreground">PIN or QR</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <h2 className="font-bold text-foreground mb-3">Your active donations</h2>
        {active.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center">
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
            {active.map((d) => (
              <DonationCard
                key={d.id}
                donation={d}
                onClaim={d.status === "CLAIMED" ? () => navigate("/donor/verify") : undefined}
                ctaLabel={d.status === "CLAIMED" ? `Verify pickup · PIN ${d.pinCode}` : ""}
              />
            ))}
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
