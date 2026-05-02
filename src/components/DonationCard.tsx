import { useState } from "react";
import { Clock, MapPin, Store, Heart, ChevronDown, ShieldCheck, AlertTriangle, Calendar, Navigation, CheckCircle2, Sparkles } from "lucide-react";
import { Donation } from "@/context/NimaContext";
import { timeAgo, timeLeft } from "@/lib/time";
import {
  categoryCardFallbackSrc,
  categoryPublicCardSrc,
  labelForCategory,
  labelForPackaging,
} from "@/lib/foodTaxonomy";
import { GoogleMapView, googleDirectionsLink, googleMapsLink } from "@/components/MapPicker";

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70&auto=format&fit=crop";

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
  const [confirming, setConfirming] = useState(false);
  const openTrayWarning = donation.packaging === "OPEN_TRAY";
  const photo = donation.photo || FALLBACK_PHOTO;
  const listItems = donation.items?.filter(Boolean) ?? [];
  const heroAlt = listItems.length > 0 ? listItems.join(", ") : donation.foodDescription;

  return (
    <div className="bg-card rounded-2xl shadow-soft shadow-[0_8px_30px_-8px_rgba(2,219,150,0.12)] ring-1 ring-black/[0.04] animate-slide-up overflow-hidden">
      {/* Hero photo */}
      <div className="relative h-32 w-full overflow-hidden bg-muted">
        <img src={photo} alt={heroAlt} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span
          className={`absolute top-2 right-2 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap backdrop-blur ${
            t.expired
              ? "bg-destructive text-destructive-foreground"
              : t.urgent
                ? "bg-secondary text-secondary-foreground ring-2 ring-destructive/50"
                : "bg-secondary text-secondary-foreground"
          }`}
        >
          <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
          {t.label}
        </span>
        {donation.foodCategory && (
          <span className="absolute top-2 left-2 text-[11px] bg-white/95 text-foreground font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1.5">
            <img
              src={categoryPublicCardSrc(donation.foodCategory)}
              alt=""
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = categoryCardFallbackSrc(donation.foodCategory);
              }}
              className="w-5 h-5 rounded-full object-cover"
            />
            {labelForCategory(donation.foodCategory)}
          </span>
        )}
        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isIndividual
                ? "bg-gradient-warm text-secondary-foreground"
                : "bg-gradient-primary text-primary-foreground"
            }`}
          >
            {isIndividual ? <Heart className="w-4 h-4" /> : <Store className="w-4 h-4" />}
          </div>
          <div className="min-w-0 text-white drop-shadow">
            <h3 className="font-bold text-sm truncate">
              {isIndividual ? `From ${donation.businessName}` : donation.businessName}
            </h3>
            <p className="text-[11px] opacity-90">{donation.businessType} · {timeAgo(donation.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {(donation.status === "COLLECTED" || donation.status === "EXPIRED") && (
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${
              donation.status === "COLLECTED"
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {donation.status === "COLLECTED" ? "Rescued" : "Expired"}
          </span>
        )}
        {listItems.length > 0 ? (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Inside this sharing</p>
            <ul className="space-y-1">
              {listItems.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-foreground leading-snug">
                  <span className="text-primary font-bold shrink-0">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 mb-3 line-clamp-3">{donation.foodDescription}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-ai shrink-0" aria-hidden />
            <span className="text-foreground">{donation.quantity}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {donation.pickupArea}
          </span>
          {openTrayWarning && (
            <span className="text-[11px] bg-destructive/10 text-destructive font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Open tray
            </span>
          )}
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
              <div className="rounded-xl overflow-hidden shadow-inner ring-1 ring-black/[0.06]">
                <GoogleMapView point={donation.location} height={170} />
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
                    className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-gradient-warm text-secondary-foreground inline-flex items-center justify-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {onClaim && !confirming && (
          <button
            onClick={() => setConfirming(true)}
            disabled={disabled || t.expired}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-elevated hover:bg-primary/90 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {ctaLabel}
          </button>
        )}

        {onClaim && confirming && (
          <div className="space-y-2 animate-scale-in">
            <div className="text-xs text-center text-muted-foreground bg-muted/50 rounded-lg p-2">
              Reserving holds this meal for you. Please come pick it up before it expires.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 bg-card border border-border text-foreground font-semibold py-3 rounded-xl active:scale-[0.99] transition"
              >
                Cancel
              </button>
              <button
                onClick={onClaim}
                disabled={disabled || t.expired}
                className="flex-[2] bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-elevated hover:bg-primary/90 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Activate reservation
              </button>
            </div>
          </div>
        )}
      </div>
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
