import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { QrMock } from "@/components/QrMock";
import { Clock, MapPin, Store } from "lucide-react";
import { timeLeft } from "@/lib/time";

export default function BeneficiaryQR() {
  const navigate = useNavigate();
  const { beneficiary, myClaim, myActiveDonation } = useNima();
  const claim = myClaim();
  const donation = myActiveDonation();

  useEffect(() => {
    if (!beneficiary) navigate("/");
  }, [beneficiary, navigate]);

  // Auto-redirect if claim collected
  useEffect(() => {
    if (beneficiary && !claim) {
      // could be just-collected or never claimed
    }
  }, [beneficiary, claim]);

  if (!beneficiary) return null;

  if (!claim || !donation) {
    return (
      <MobileFrame>
        <TopBar title="Your code" onBack={() => navigate("/beneficiary/home")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-bold text-lg mb-2">No active claim</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Pick something from the list to get a pickup code.
          </p>
          <button
            onClick={() => navigate("/beneficiary/home")}
            className="bg-gradient-primary text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-elevated"
          >
            Browse food
          </button>
        </div>
      </MobileFrame>
    );
  }

  const t = timeLeft(donation.expiresAt);

  return (
    <MobileFrame>
      <TopBar title="Show this at pickup" onBack={() => navigate("/beneficiary/home")} variant="primary" />
      <div className="flex-1 overflow-y-auto bg-gradient-primary text-primary-foreground px-5 pb-6 -mt-1">
        <div className="bg-white text-foreground rounded-3xl p-6 shadow-2xl mt-2 animate-scale-in">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-primary" />
            <div className="min-w-0">
              <p className="font-bold truncate">{donation.businessName}</p>
              <p className="text-xs text-muted-foreground">{donation.businessType}</p>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <QrMock value={`NIMA-${beneficiary.id}-${claim.pinCode}`} size={220} />
          </div>

          <div className="text-center mb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Or share this PIN
            </p>
            <p className="text-5xl font-black tracking-[0.4em] text-primary">{claim.pinCode}</p>
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <p className="font-semibold">{donation.foodDescription}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {donation.pickupArea}
              </span>
              <span className={`flex items-center gap-1 font-semibold ${t.urgent ? "text-destructive" : "text-success"}`}>
                <Clock className="w-3.5 h-3.5" /> {t.label}
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs opacity-90 mt-5">
          Your identity stays private. Only your code is shared.
        </p>
      </div>
    </MobileFrame>
  );
}
