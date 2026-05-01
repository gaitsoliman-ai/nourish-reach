import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DonorCreatePrefillState } from "@/components/DonorAiBot";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { toast } from "sonner";
import { Clock, MapPin, ShieldCheck, ClipboardList, Check, Calendar, AlertTriangle } from "lucide-react";
import {
  FOOD_CATEGORIES,
  FoodCategory,
  PACKAGING_OPTIONS,
  Packaging,
  COMMON_ALLERGENS,
  photoForCategory,
  categoryPublicCardSrc,
  categoryCardFallbackSrc,
} from "@/lib/foodTaxonomy";
import { FoodCategoryCard } from "@/components/FoodCategoryCard";
import { MapPicker, LatLng } from "@/components/MapPicker";

const PRESETS = [
  { label: "30 min", mins: 30 },
  { label: "1 hr", mins: 60 },
  { label: "2 hrs", mins: 120 },
  { label: "4 hrs", mins: 240 },
];

const STEPS = ["Food", "Safety", "Pickup", "Review"] as const;

export default function DonorCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { donor, createDonation } = useNima();
  const prefillApplied = useRef(false);

  const [step, setStep] = useState(0);

  // Step 1 — food
  const [category, setCategory] = useState<FoodCategory | "">("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [bestBefore, setBestBefore] = useState(""); // datetime-local

  // Step 2 — safety
  const [packaging, setPackaging] = useState<Packaging | "">("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [customAllergen, setCustomAllergen] = useState("");
  const [hygiene, setHygiene] = useState("");

  // Step 3 — pickup
  const [mins, setMins] = useState(60);
  const [customH, setCustomH] = useState("");
  const [customM, setCustomM] = useState("");
  const [pickupArea, setPickupArea] = useState("");
  const [locNotes, setLocNotes] = useState("");
  const [pin, setPin] = useState<LatLng | null>(null);

  useEffect(() => {
    const prefill = (location.state as { aiPrefill?: DonorCreatePrefillState } | null)?.aiPrefill;
    if (!prefill || prefillApplied.current) return;
    prefillApplied.current = true;
    setCategory(prefill.category);
    setDesc(prefill.desc);
    setQty(prefill.qty);
    if (prefill.pickupArea) setPickupArea(prefill.pickupArea);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  const computeMinutes = () => {
    const h = parseInt(customH || "0", 10) || 0;
    const m = parseInt(customM || "0", 10) || 0;
    const custom = h * 60 + m;
    return custom > 0 ? custom : mins;
  };
  const customActive = (parseInt(customH || "0", 10) || 0) + (parseInt(customM || "0", 10) || 0) > 0;

  const toggleAllergen = (a: string) =>
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!category) return "Pick a food type";
      if (!desc.trim()) return "Describe the food briefly";
      if (!qty.trim()) return "Add a quantity";
    }
    if (step === 1) {
      if (!packaging) return "Tell people how it's packaged";
    }
    if (step === 2) {
      if (computeMinutes() < 5) return "Pickup window is too short";
      if (!pickupArea.trim()) return "Add a pickup area name";
      if (!pin) return "Drop a pin on the map for the pickup spot";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) return toast.error(err);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => (step === 0 ? navigate("/donor/dashboard") : setStep((s) => s - 1));

  const submit = () => {
    const err = validateStep();
    if (err) return toast.error(err);
    const totalMins = computeMinutes();
    createDonation({
      foodDescription: desc.trim(),
      quantity: qty.trim(),
      pickupArea: pickupArea.trim(),
      expiresAt: Date.now() + totalMins * 60 * 1000,
      foodCategory: category as FoodCategory,
      bestBefore: bestBefore ? new Date(bestBefore).getTime() : undefined,
      packaging: packaging as Packaging,
      allergens,
      hygieneNotes: hygiene.trim() || undefined,
      photo: photoForCategory(category as FoodCategory),
      location: pin
        ? { lat: pin.lat, lng: pin.lng, area: pickupArea.trim(), notes: locNotes.trim() || undefined }
        : undefined,
    });
    toast.success("Donation posted! People nearby can see it.");
    navigate("/donor/dashboard");
  };

  return (
    <MobileFrame>
      <TopBar
        title="New donation"
        subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`}
        onBack={back}
      />

      {/* Progress */}
      <div className="px-5 pb-3">
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        {step === 0 && (
          <FoodStep
            category={category}
            setCategory={setCategory}
            desc={desc}
            setDesc={setDesc}
            qty={qty}
            setQty={setQty}
            bestBefore={bestBefore}
            setBestBefore={setBestBefore}
          />
        )}

        {step === 1 && (
          <SafetyStep
            packaging={packaging}
            setPackaging={setPackaging}
            allergens={allergens}
            toggleAllergen={toggleAllergen}
            customAllergen={customAllergen}
            setCustomAllergen={setCustomAllergen}
            addCustomAllergen={() => {
              const v = customAllergen.trim();
              if (v && !allergens.includes(v)) setAllergens((p) => [...p, v]);
              setCustomAllergen("");
            }}
            hygiene={hygiene}
            setHygiene={setHygiene}
          />
        )}

        {step === 2 && (
          <PickupStep
            mins={mins}
            setMins={setMins}
            customH={customH}
            setCustomH={setCustomH}
            customM={customM}
            setCustomM={setCustomM}
            customActive={customActive}
            pickupArea={pickupArea}
            setPickupArea={setPickupArea}
            locNotes={locNotes}
            setLocNotes={setLocNotes}
            pin={pin}
            setPin={setPin}
          />
        )}

        {step === 3 && (
          <ReviewStep
            category={category as FoodCategory}
            desc={desc}
            qty={qty}
            bestBefore={bestBefore}
            packaging={packaging as Packaging}
            allergens={allergens}
            hygiene={hygiene}
            mins={computeMinutes()}
            pickupArea={pickupArea}
            locNotes={locNotes}
            pin={pin}
          />
        )}

        <div className="flex-1" />

        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex-1 bg-card border border-border text-foreground font-semibold py-4 rounded-2xl active:scale-[0.99] transition"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex-[2] bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="flex-[2] bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Post donation
            </button>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}

/* ------------------- STEPS ------------------- */

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function FoodStep(p: any) {
  return (
    <>
      <SectionTitle icon={ClipboardList} title="What food are you sharing?" subtitle="Help people know what to expect." />
      <label className="text-sm font-semibold mb-2 block">Food type</label>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {FOOD_CATEGORIES.map((c) => (
          <FoodCategoryCard
            key={c.value}
            value={c.value}
            label={c.label}
            hint={c.hint}
            selected={p.category === c.value}
            onSelect={() => p.setCategory(c.value)}
          />
        ))}
      </div>

      <label className="text-sm font-semibold mb-2">Description</label>
      <textarea
        value={p.desc}
        onChange={(e) => p.setDesc(e.target.value)}
        rows={3}
        maxLength={300}
        placeholder="e.g. Fresh bread, croissants, sandwiches..."
        className="bg-card border border-border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-primary transition resize-none w-full"
      />

      <label className="text-sm font-semibold mb-2">Quantity</label>
      <input
        value={p.qty}
        onChange={(e) => p.setQty(e.target.value)}
        placeholder="e.g. 10 portions, 5 meals"
        maxLength={60}
        className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition w-full"
      />

      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Best before <span className="text-xs font-normal text-muted-foreground">(optional)</span>
      </label>
      <input
        type="datetime-local"
        value={p.bestBefore}
        onChange={(e) => p.setBestBefore(e.target.value)}
        className="bg-card border border-border rounded-xl px-4 py-3.5 mb-1 outline-none focus:ring-2 focus:ring-primary transition w-full"
      />
      <p className="text-xs text-muted-foreground">If you know an exact expiry/use-by date, set it here.</p>
    </>
  );
}

function SafetyStep(p: any) {
  return (
    <>
      <SectionTitle icon={ShieldCheck} title="Safety & allergens" subtitle="Be open about packaging and ingredients — it builds trust." />

      <label className="text-sm font-semibold mb-2 block">How is it packaged?</label>
      <div className="grid grid-cols-1 gap-2 mb-5">
        {PACKAGING_OPTIONS.map((o) => {
          const isOpen = o.value === "OPEN_TRAY";
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => p.setPackaging(o.value)}
              className={`text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                p.packaging === o.value
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isOpen ? "bg-destructive/10 text-destructive" : "bg-tertiary/10 text-tertiary"}`}>
                {isOpen ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{o.label}</div>
                <div className="text-xs text-muted-foreground">{o.hint}</div>
              </div>
            </button>
          );
        })}
      </div>

      <label className="text-sm font-semibold mb-2 block">Possible allergens</label>
      <p className="text-xs text-muted-foreground mb-2">Select anything the food may contain.</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {COMMON_ALLERGENS.map((a) => {
          const on = p.allergens.includes(a);
          return (
            <button
              type="button"
              key={a}
              onClick={() => p.toggleAllergen(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                on
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              }`}
            >
              {a}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mb-5">
        <input
          value={p.customAllergen}
          onChange={(e) => p.setCustomAllergen(e.target.value)}
          placeholder="Add another allergen…"
          maxLength={30}
          className="flex-1 bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={p.addCustomAllergen}
          className="px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm"
        >
          Add
        </button>
      </div>
      {p.allergens.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-5">
          {p.allergens.map((a: string) => (
            <span key={a} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {a}
            </span>
          ))}
        </div>
      )}

      <label className="text-sm font-semibold mb-2">Hygiene notes <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
      <textarea
        value={p.hygiene}
        onChange={(e) => p.setHygiene(e.target.value)}
        rows={3}
        maxLength={250}
        placeholder="e.g. Sealed straight after cooking, kept refrigerated, gloves used while handling…"
        className="bg-card border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition resize-none w-full"
      />
    </>
  );
}

function PickupStep(p: any) {
  return (
    <>
      <SectionTitle icon={MapPin} title="Pickup details" subtitle="Drop a pin so people can find you instantly." />

      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Pickup within
      </label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {PRESETS.map((w) => (
          <button
            type="button"
            key={w.mins}
            onClick={() => {
              p.setMins(w.mins);
              p.setCustomH("");
              p.setCustomM("");
            }}
            className={`py-3 rounded-xl text-sm font-medium border transition ${
              !p.customActive && p.mins === w.mins
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mb-1">Or set custom:</div>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="relative">
          <input
            type="number"
            min={0}
            max={48}
            value={p.customH}
            onChange={(e) => p.setCustomH(e.target.value)}
            placeholder="0"
            className={`w-full bg-card border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition pr-14 ${p.customActive ? "border-primary" : "border-border"}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">hours</span>
        </div>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={59}
            value={p.customM}
            onChange={(e) => p.setCustomM(e.target.value)}
            placeholder="0"
            className={`w-full bg-card border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition pr-14 ${p.customActive ? "border-primary" : "border-border"}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mins</span>
        </div>
      </div>

      <label className="text-sm font-semibold mb-2">Pickup area name</label>
      <input
        value={p.pickupArea}
        onChange={(e) => p.setPickupArea(e.target.value)}
        placeholder="e.g. Downtown · Olive Park · Marina"
        maxLength={80}
        className="bg-card border border-border rounded-xl px-4 py-3.5 mb-4 outline-none focus:ring-2 focus:ring-primary transition w-full"
      />

      <label className="text-sm font-semibold mb-2">Drop a pin on the map</label>
      <div className="mb-3">
        <MapPicker value={p.pin} onChange={p.setPin} />
      </div>
      {p.pin && (
        <p className="text-xs text-tertiary mb-3 flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> Location set ({p.pin.lat.toFixed(4)}, {p.pin.lng.toFixed(4)})
        </p>
      )}

      <label className="text-sm font-semibold mb-2">Pickup instructions <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
      <textarea
        value={p.locNotes}
        onChange={(e) => p.setLocNotes(e.target.value)}
        rows={2}
        maxLength={200}
        placeholder="e.g. Side door, ring bell, parking on street…"
        className="bg-card border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition resize-none w-full"
      />
    </>
  );
}

function ReviewStep(p: any) {
  const cat = FOOD_CATEGORIES.find((c) => c.value === p.category);
  const pkg = PACKAGING_OPTIONS.find((x) => x.value === p.packaging);
  return (
    <>
      <SectionTitle icon={Check} title="Review & post" subtitle="Quick check before it goes live." />

      <div className="space-y-3">
        <Row label="Food">
          <div className="flex items-center gap-2">
            {cat && (
              <img
                src={categoryPublicCardSrc(cat.value)}
                alt={cat.label}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = categoryCardFallbackSrc(cat.value);
                }}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            )}
            <span className="font-semibold">{cat?.label}</span>
          </div>
        </Row>
        <Row label="Description">{p.desc}</Row>
        <Row label="Quantity">{p.qty}</Row>
        {p.bestBefore && <Row label="Best before">{new Date(p.bestBefore).toLocaleString()}</Row>}
        <Row label="Packaging">{pkg?.label}</Row>
        <Row label="Allergens">
          {p.allergens.length === 0 ? (
            <span className="text-muted-foreground">None reported</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {p.allergens.map((a: string) => (
                <span key={a} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          )}
        </Row>
        {p.hygiene && <Row label="Hygiene">{p.hygiene}</Row>}
        <Row label="Pickup window">{`${Math.floor(p.mins / 60)}h ${p.mins % 60}m`}</Row>
        <Row label="Area">{p.pickupArea}</Row>
        {p.locNotes && <Row label="Instructions">{p.locNotes}</Row>}
        {p.pin && (
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Map</div>
            <MapPicker value={p.pin} onChange={() => {}} interactive={false} height={160} />
          </div>
        )}
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
