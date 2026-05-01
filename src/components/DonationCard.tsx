import { useState } from "react";
import { Clock, MapPin, Package, Store, Heart, ChevronDown, ShieldCheck, AlertTriangle, Calendar, Navigation } from "lucide-react";
import { Donation } from "@/context/NimaContext";
import { timeAgo, timeLeft } from "@/lib/time";
import { emojiForCategory, labelForCategory, labelForPackaging } from "@/lib/foodTaxonomy";
import { MapPicker, googleDirectionsLink, googleMapsLink } from "@/components/MapPicker";

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
  const [open, setOpen] = useState(false);
  const openTrayWarning = donation.packaging === "OPEN_TRAY";

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
            t.urgent ? "bg-destructive/10 text-destructive" : "bg-tertiary/10 text-tertiary"
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
          {t.label}
        </span>
      </div>

      {donation.foodCategory && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs bg-secondary/10 text-secondary font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <span>{emojiForCategory(donation.foodCategory)}</span>
            {labelForCategory(donation.foodCategory)}
          </span>
          {openTrayWarning && (
            <span className="text-xs bg-destructive/10 text-destructive font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Open tray
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-foreground/90 mb-3 line-clamp-2">{donation.foodDescription}</p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
        <span className="flex items-center gap-1">
          <Package className="w-3.5 h-3.5" /> {donation.quantity}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {donation.pickupArea}
        </span>
      </div>

      {donation.allergens && donation.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {donation.allergens.slice(0, 4).map((a) => (
            <span key={a} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              ⚠ {a}
            </span>
          ))}
          {donation.allergens.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{donation.allergens.length - 4}</span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-secondary font-semibold flex items-center gap-1 mb-3"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide details" : "View details & map"}
      </button>

      {open && (
        <div className="space-y-2 mb-3 animate-slide-up">
          {donation.packaging && (
            <DetailRow icon={ShieldCheck} label="Packaging" value={labelForPackaging(donation.packaging)} />
          )}
          {donation.bestBefore && (
            <DetailRow icon={Calendar} label="Best before" value={new Date(donation.bestBefore).toLocaleString()} />
          )}
          {donation.hygieneNotes && (
            <DetailRow icon={ShieldCheck} label="Hygiene" value={donation.hygieneNotes} />
          )}
          {donation.location?.notes && (
            <DetailRow icon={MapPin} label="Pickup notes" value={donation.location.notes} />
          )}
          {donation.location && (
            <div className="rounded-xl overflow-hidden border border-border">
              <MapPicker value={donation.location} onChange={() => {}} interactive={false} height={160} />
              <div className="flex gap-2 p-2 bg-card">
                <a
                  href={googleMapsLink(donation.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-secondary/10 text-secondary"
                >
                  Open in Google Maps
                </a>
                <a
                  href={googleDirectionsLink(donation.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-gradient-trust text-accent-foreground inline-flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" /> Directions
                </a>
              </div>
            </div>
          )}
        </div>
      )}

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

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <div className="text-muted-foreground">{label}</div>
        <div className="text-foreground">{value}</div>
      </div>
    </div>
  );
}
