import { Clock, MapPin, Package, Store, Heart } from "lucide-react";
import { Donation } from "@/context/NimaContext";
import { timeAgo, timeLeft } from "@/lib/time";

export function DonationCard({
  donation,
  onClaim,
  disabled,
  ctaLabel = "Reserve",
}: {
  donation: Donation;
  onClaim?: () => void;
  disabled?: boolean;
  ctaLabel?: string;
}) {
  const t = timeLeft(donation.expiresAt);
  const isIndividual = donation.donorKind === "INDIVIDUAL";
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0 ${isIndividual ? "bg-gradient-trust" : "bg-gradient-primary"}`}>
            {isIndividual ? <Heart className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {isIndividual ? `From ${donation.businessName}` : donation.businessName}
            </h3>
            <p className="text-xs text-muted-foreground">{donation.businessType} · {timeAgo(donation.createdAt)}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
            t.urgent
              ? "bg-destructive/10 text-destructive"
              : "bg-success/10 text-success"
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
          {t.label}
        </span>
      </div>

      <p className="text-sm text-foreground/90 mb-3 line-clamp-2">{donation.foodDescription}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
        <span className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5" /> {donation.quantity}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {donation.pickupArea}
        </span>
      </div>

      {onClaim && (
        <button
          onClick={onClaim}
          disabled={disabled || t.expired}
          className="w-full bg-gradient-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-elevated hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
