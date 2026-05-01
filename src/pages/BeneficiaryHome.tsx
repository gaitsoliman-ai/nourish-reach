import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { DonationCard } from "@/components/DonationCard";
import { toast } from "sonner";
import { LogOut, QrCode, ShieldCheck, Utensils } from "lucide-react";

export default function BeneficiaryHome() {
  const navigate = useNavigate();
  const { beneficiary, donations, claimDonation, logout, myClaim, myActiveDonation } = useNima();
  const [, force] = useState(0);

  useEffect(() => {
    if (!beneficiary) navigate("/");
  }, [beneficiary, navigate]);

  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  if (!beneficiary) return null;

  const active = myClaim();
  const activeDonation = myActiveDonation();
  const available = donations.filter((d) => d.status === "AVAILABLE");

  const handleClaim = (id: string) => {
    if (active) {
      toast.error("You already have an active claim. Pick it up first.");
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

  return (
    <MobileFrame>
      <div className="bg-gradient-trust text-accent-foreground px-5 pt-7 pb-7 rounded-b-3xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-90">Anonymous</span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            aria-label="Exit"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold">Meals shared near you</h1>
        <p className="text-sm opacity-90">A blessing offered with kindness — yours to enjoy.</p>
      </div>

      {active && activeDonation && (
        <button
          onClick={() => navigate("/beneficiary/qr")}
          className="mx-5 -mt-4 relative z-10 bg-gradient-primary text-primary-foreground rounded-2xl p-4 shadow-elevated text-left animate-pulse-glow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider opacity-90">Active claim</p>
              <p className="font-bold truncate">{activeDonation.businessName}</p>
              <p className="text-xs opacity-90">Tap to show your PIN · {active.pinCode}</p>
            </div>
          </div>
        </button>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground">Available now</h2>
          <span className="text-xs text-muted-foreground">{available.length} items</span>
        </div>

        {available.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center mt-4">
            <Utensils className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-semibold mb-1">Nothing available right now</p>
            <p className="text-sm text-muted-foreground">
              Check back soon — businesses post throughout the day.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {available.map((d) => (
              <DonationCard
                key={d.id}
                donation={d}
                onClaim={() => handleClaim(d.id)}
                disabled={!!active}
                ctaLabel={active ? "Finish your active claim first" : "Claim this"}
              />
            ))}
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
