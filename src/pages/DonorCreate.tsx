import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DonorCreatePrefillState } from "@/components/DonorAiBot";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { toast } from "sonner";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Bot,
  Send,
  Store,
  Wheat,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  FOOD_CATEGORIES,
  FoodCategory,
  PACKAGING_OPTIONS,
  Packaging,
  COMMON_ALLERGENS,
  photoForCategory,
  categoryPublicCardSrc,
  categoryCardFallbackSrc,
  quickItemsForCategory,
} from "@/lib/foodTaxonomy";
import { FoodCategoryCard } from "@/components/FoodCategoryCard";
import { MapPicker, LatLng } from "@/components/MapPicker";
import { StepIndicator, StepHeader } from "@/components/StepIndicator";
import { MINT, PURPLE_AI, PURPLE_SOFT, SLATE, SOFT_MINT, shadowCard } from "@/lib/barakahDesign";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "30 min", mins: 30 },
  { label: "1 hr", mins: 60 },
  { label: "2 hrs", mins: 120 },
  { label: "4 hrs", mins: 240 },
];

const TOTAL_STEPS = 4;

export default function DonorCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { donor, createDonation } = useNima();
  const prefillApplied = useRef(false);

  const [step, setStep] = useState(0);

  const [category, setCategory] = useState<FoodCategory | "">("");
  const [items, setItems] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [bestBefore, setBestBefore] = useState("");

  const [packaging, setPackaging] = useState<Packaging | "">("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [customAllergen, setCustomAllergen] = useState("");
  const [hygiene, setHygiene] = useState("");

  const [mins, setMins] = useState(60);
  const [customH, setCustomH] = useState("");
  const [customM, setCustomM] = useState("");
  const [pickupArea, setPickupArea] = useState("");
  const [locNotes, setLocNotes] = useState("");
  const [pin, setPin] = useState<LatLng | null>(null);

  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const prefill = (location.state as { aiPrefill?: DonorCreatePrefillState } | null)?.aiPrefill;
    if (!prefill || prefillApplied.current) return;
    prefillApplied.current = true;
    setCategory(prefill.category);
    setDesc(prefill.desc);
    setQty(prefill.qty);
    if (prefill.pickupArea) setPickupArea(prefill.pickupArea);
    setStep(1);
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
    if (step === 1) {
      if (!category) return "Pick a food type";
      if (!desc.trim() && items.length === 0) return "Add a short description or pick quick items";
      if (!qty.trim()) return "Add a quantity";
    }
    if (step === 2) {
      if (!packaging) return "Tell people how it's packaged";
    }
    if (step === 3) {
      if (computeMinutes() < 5) return "Pickup window is too short";
      if (!pickupArea.trim()) return "Add a pickup area name";
      if (!pin) return "Drop a pin on the map for the pickup spot";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) return toast.error(err);
    if (step === 0 && chatInput.trim()) {
      setDesc((d) => (d.trim() ? d : chatInput.trim()));
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const back = () => (step === 0 ? navigate("/donor/dashboard") : setStep((s) => s - 1));

  const submit = () => {
    const err = validateStep();
    if (err) return toast.error(err);
    const totalMins = computeMinutes();
    const cat = category as FoodCategory;
    const fromItems = items.length > 0 ? items.join(" · ") : "";
    const foodDescription = [fromItems, desc.trim()].filter(Boolean).join(" — ") || fromItems || desc.trim();
    createDonation({
      foodDescription,
      items: items.length > 0 ? [...items] : undefined,
      quantity: qty.trim(),
      pickupArea: pickupArea.trim(),
      expiresAt: Date.now() + totalMins * 60 * 1000,
      foodCategory: cat,
      bestBefore: bestBefore ? new Date(bestBefore).getTime() : undefined,
      packaging: packaging as Packaging,
      allergens,
      hygieneNotes: hygiene.trim() || undefined,
      photo: photoForCategory(cat),
      location: pin
        ? { lat: pin.lat, lng: pin.lng, area: pickupArea.trim(), notes: locNotes.trim() || undefined }
        : undefined,
    });
    toast.success("Donation posted! People nearby can see it.");
    navigate("/donor/dashboard");
  };

  const stepTitles = [
    { title: "AI Capture", sub: "Tell me what you have to donate. I'll take care of the rest." },
    { title: "Smart Categorization", sub: "Help us route your donation quickly and safely by confirming these details." },
    { title: "Safety & allergens", sub: "Be open about packaging and ingredients — it builds trust." },
    { title: "Pickup & review", sub: "Drop a pin and confirm details before posting." },
  ];

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <header className="shrink-0 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={back}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-[#0A4D3C]"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0 text-center pr-10">
              <p className="text-xs font-bold" style={{ color: MINT }}>
                Barakah <span className="text-slate-800">Donor App</span>
              </p>
            </div>
          </div>
          <StepIndicator current={step + 1} total={TOTAL_STEPS} />
        </header>

        <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
          <div className="pt-4 pb-2">
            <StepHeader
              step={step + 1}
              total={TOTAL_STEPS}
              title={stepTitles[step].title}
              subtitle={stepTitles[step].sub}
            />
          </div>

          {step === 0 && (
            <AiCaptureStep chatInput={chatInput} setChatInput={setChatInput} />
          )}

          {step === 1 && (
            <SmartCategorizationStep
              category={category}
              setCategory={(c: FoodCategory) => {
                setCategory(c);
                setItems([]);
              }}
              items={items}
              setItems={setItems}
              desc={desc}
              setDesc={setDesc}
              qty={qty}
              setQty={setQty}
              bestBefore={bestBefore}
              setBestBefore={setBestBefore}
            />
          )}

          {step === 2 && (
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

          {step === 3 && (
            <>
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
              <div className="mt-8 mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Review</h3>
              </div>
              <ReviewStep
                category={category as FoodCategory}
                items={items}
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
            </>
          )}

          <div className="flex-1 min-h-4" />

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-[env(safe-area-inset-bottom)]">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex-1 border border-gray-200 text-slate-800 font-semibold py-4 rounded-3xl active:scale-[0.99] transition bg-white"
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={next}
                className="flex-[2] font-bold py-4 rounded-3xl text-white shadow-lg active:scale-[0.99] transition"
                style={{ backgroundColor: MINT, boxShadow: shadowCard }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="flex-[2] font-bold py-4 rounded-3xl text-white shadow-lg active:scale-[0.99] transition flex items-center justify-center gap-2"
                style={{ backgroundColor: MINT }}
              >
                <Check className="w-5 h-5" /> Post donation
              </button>
            )}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

function AiCaptureStep({
  chatInput,
  setChatInput,
}: {
  chatInput: string;
  setChatInput: (s: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: PURPLE_SOFT }}
        >
          <Sparkles className="h-7 w-7" style={{ color: PURPLE_AI }} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 justify-end items-end">
          <div className="max-w-[80%] rounded-3xl rounded-tr-md px-4 py-3 text-sm shadow-sm" style={{ backgroundColor: SOFT_MINT }}>
            <p className="text-slate-800 font-medium">I have 15 sandwiches</p>
            <p className="text-[10px] text-slate-500 mt-1 text-right">9:41 AM ✓✓</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: SOFT_MINT }}>
            <Store className="h-4 w-4" style={{ color: MINT }} />
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: PURPLE_AI }}
          >
            <Bot className="h-4 w-4" />
          </div>
          <div className="max-w-[85%] rounded-3xl rounded-tl-md px-4 py-3 text-sm shadow-sm" style={{ backgroundColor: PURPLE_SOFT }}>
            <p className="text-slate-800">Noted! Categorizing now.</p>
            <p className="text-[10px] text-slate-500 mt-1">9:41 AM</p>
          </div>
        </div>

        <div className="flex gap-1 pl-12">
          <span className="inline-block h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: PURPLE_AI }} />
          <span className="inline-block h-2 w-2 rounded-full animate-bounce [animation-delay:120ms]" style={{ backgroundColor: PURPLE_AI }} />
          <span className="inline-block h-2 w-2 rounded-full animate-bounce [animation-delay:240ms]" style={{ backgroundColor: PURPLE_AI }} />
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-3xl border border-gray-100 bg-white px-4 py-2 shadow-sm mt-6"
        style={{ boxShadow: shadowCard }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0"
          style={{ backgroundColor: PURPLE_AI }}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SmartCategorizationStep(p: {
  category: FoodCategory | "";
  setCategory: (c: FoodCategory) => void;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  desc: string;
  setDesc: (v: string) => void;
  qty: string;
  setQty: (v: string) => void;
  bestBefore: string;
  setBestBefore: (v: string) => void;
}) {
  const quick = p.category ? quickItemsForCategory(p.category as FoodCategory) : [];
  const toggleQuick = (label: string) => {
    p.setItems((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  };

  const bakeryPicked = p.category === "BAKED";
  const glutenNote = p.category === "BAKED" || p.category === "PREPARED_HOT";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>
          Suggested Categories
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => p.setCategory("BAKED")}
            className={cn(
              "w-full flex items-center gap-3 rounded-3xl p-4 text-left border transition shadow-sm",
              bakeryPicked ? "border-[#02db96]/40 bg-[#e6faf4]" : "border-gray-100 bg-[#e6faf4]/60"
            )}
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Store className="h-5 w-5" style={{ color: MINT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Bakery</p>
              <p className="text-xs text-slate-500">Bread, pastries, cakes</p>
            </div>
            {bakeryPicked ? (
              <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: MINT }} strokeWidth={2.5} />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-gray-200 shrink-0" />
            )}
          </button>

          <div
            className="flex items-center gap-3 rounded-3xl p-4 border border-gray-100 bg-[#e6faf4]/80"
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Wheat className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Allergens: Gluten</p>
              <p className="text-xs text-slate-500">Shown when bakery / prepared meals selected</p>
            </div>
            {glutenNote ? (
              <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: MINT }} strokeWidth={2.5} />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-gray-200 shrink-0" />
            )}
          </div>

          <div
            className="flex items-center gap-3 rounded-3xl p-4 border border-gray-100 bg-[#e6faf4]/80"
            style={{ boxShadow: shadowCard }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShieldCheck className="h-5 w-5" style={{ color: MINT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Hygiene Verified</p>
              <p className="text-xs text-slate-500">Confirm packaging on the next step</p>
            </div>
            <CheckCircle2 className="h-6 w-6 shrink-0 text-gray-300" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-3 flex gap-2 text-xs text-slate-600" style={{ boxShadow: shadowCard }}>
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
        These tags help recipients understand and safely accept your donation.
      </div>

      <label className="text-sm font-semibold mb-2 block" style={{ color: SLATE }}>
        Full category list
      </label>
      <div className="grid grid-cols-2 gap-2 mb-4">
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

      {quick.length > 0 && (
        <div className="mb-5">
          <label className="text-sm font-semibold mb-2 block">Quick select</label>
          <div className="flex flex-wrap gap-2">
            {quick.map((label) => {
              const on = p.items.includes(label);
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => toggleQuick(label)}
                  className={cn(
                    "px-3 py-2 rounded-full text-xs font-semibold border transition",
                    on ? "text-white border-transparent shadow-sm" : "bg-white border-gray-200 text-slate-800"
                  )}
                  style={on ? { backgroundColor: MINT } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <label className="text-sm font-semibold mb-2" style={{ color: SLATE }}>
        Description
      </label>
      <textarea
        value={p.desc}
        onChange={(e) => p.setDesc(e.target.value)}
        rows={3}
        maxLength={300}
        placeholder="Optional extra detail…"
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3 mb-5 outline-none focus:ring-2 transition resize-none w-full"
        style={{ ["--tw-ring-color" as string]: `${MINT}66` }}
      />

      <label className="text-sm font-semibold mb-2" style={{ color: SLATE }}>
        Quantity
      </label>
      <input
        value={p.qty}
        onChange={(e) => p.setQty(e.target.value)}
        placeholder="e.g. 10 portions, 5 meals"
        maxLength={60}
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3.5 mb-5 outline-none focus:ring-2 transition w-full"
      />

      <label className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: SLATE }}>
        <Calendar className="w-4 h-4" /> Best before <span className="text-xs font-normal text-slate-500">(optional)</span>
      </label>
      <input
        type="datetime-local"
        value={p.bestBefore}
        onChange={(e) => p.setBestBefore(e.target.value)}
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3.5 mb-1 outline-none focus:ring-2 transition w-full"
      />
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5" style={{ color: MINT }} />
        <h2 className="font-bold text-lg" style={{ color: SLATE }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

function SafetyStep(p: {
  packaging: Packaging | "";
  setPackaging: (v: Packaging) => void;
  allergens: string[];
  toggleAllergen: (a: string) => void;
  customAllergen: string;
  setCustomAllergen: (v: string) => void;
  addCustomAllergen: () => void;
  hygiene: string;
  setHygiene: (v: string) => void;
}) {
  return (
    <>
      <SectionTitle icon={ShieldCheck} title="Packaging & allergens" subtitle="Be open — it builds trust." />

      <label className="text-sm font-semibold mb-2 block" style={{ color: SLATE }}>
        How is it packaged?
      </label>
      <div className="grid grid-cols-1 gap-2 mb-5">
        {PACKAGING_OPTIONS.map((o) => {
          const isOpen = o.value === "OPEN_TRAY";
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => p.setPackaging(o.value)}
              className={cn(
                "text-left p-4 rounded-3xl border transition flex items-start gap-3",
                p.packaging === o.value ? "border-[#02db96] bg-[#e6faf4]/50 shadow-sm" : "border-gray-100 bg-white hover:border-[#02db96]/40"
              )}
              style={{ boxShadow: p.packaging === o.value ? shadowCard : undefined }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                  isOpen ? "bg-red-50 text-red-600" : "bg-[#e6faf4] text-[#0A4D3C]"
                )}
              >
                {isOpen ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">{o.label}</div>
                <div className="text-xs text-slate-500">{o.hint}</div>
              </div>
            </button>
          );
        })}
      </div>

      <label className="text-sm font-semibold mb-2 block" style={{ color: SLATE }}>
        Possible allergens
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {COMMON_ALLERGENS.map((a) => {
          const on = p.allergens.includes(a);
          return (
            <button
              type="button"
              key={a}
              onClick={() => p.toggleAllergen(a)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                on ? "text-white border-transparent" : "bg-white border-gray-200 text-slate-800"
              )}
              style={on ? { backgroundColor: MINT } : undefined}
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
          className="flex-1 bg-white border border-gray-200 rounded-3xl px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as string]: `${MINT}55` }}
        />
        <button
          type="button"
          onClick={p.addCustomAllergen}
          className="px-4 rounded-3xl font-semibold text-sm text-white"
          style={{ backgroundColor: MINT }}
        >
          Add
        </button>
      </div>

      <label className="text-sm font-semibold mb-2" style={{ color: SLATE }}>
        Hygiene notes <span className="text-xs font-normal text-slate-500">(optional)</span>
      </label>
      <textarea
        value={p.hygiene}
        onChange={(e) => p.setHygiene(e.target.value)}
        rows={3}
        maxLength={250}
        placeholder="e.g. Sealed straight after cooking…"
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3 outline-none focus:ring-2 transition resize-none w-full mb-4"
      />
    </>
  );
}

function PickupStep(p: {
  mins: number;
  setMins: (n: number) => void;
  customH: string;
  setCustomH: (v: string) => void;
  customM: string;
  setCustomM: (v: string) => void;
  customActive: boolean;
  pickupArea: string;
  setPickupArea: (v: string) => void;
  locNotes: string;
  setLocNotes: (v: string) => void;
  pin: LatLng | null;
  setPin: (v: LatLng | null) => void;
}) {
  return (
    <>
      <SectionTitle icon={MapPin} title="Pickup details" subtitle="Drop a pin so people can find you instantly." />

      <label className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: SLATE }}>
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
            className={cn(
              "py-3 rounded-3xl text-sm font-medium border transition",
              !p.customActive && p.mins === w.mins
                ? "text-white border-transparent shadow-md"
                : "bg-white border-gray-200 text-slate-800"
            )}
            style={!p.customActive && p.mins === w.mins ? { backgroundColor: MINT } : undefined}
          >
            {w.label}
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-500 mb-1">Or set custom:</div>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="relative">
          <input
            type="number"
            min={0}
            max={48}
            value={p.customH}
            onChange={(e) => p.setCustomH(e.target.value)}
            placeholder="0"
            className={cn(
              "w-full bg-white border rounded-3xl px-4 py-3 outline-none focus:ring-2 transition pr-14",
              p.customActive ? "border-[#02db96]" : "border-gray-200"
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">hours</span>
        </div>
        <div className="relative">
          <input
            type="number"
            min={0}
            max={59}
            value={p.customM}
            onChange={(e) => p.setCustomM(e.target.value)}
            placeholder="0"
            className={cn(
              "w-full bg-white border rounded-3xl px-4 py-3 outline-none focus:ring-2 transition pr-14",
              p.customActive ? "border-[#02db96]" : "border-gray-200"
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">mins</span>
        </div>
      </div>

      <label htmlFor="pickupAreaInput" className="text-sm font-semibold mb-2 block" style={{ color: SLATE }}>
        Pickup area name
      </label>
      <input
        id="pickupAreaInput"
        name="pickupAreaInput"
        value={p.pickupArea}
        onChange={(e) => p.setPickupArea(e.target.value)}
        placeholder="e.g. Downtown · Olive Park · Marina"
        maxLength={80}
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3.5 mb-4 outline-none focus:ring-2 transition w-full"
      />

      <label className="text-sm font-semibold mb-2" style={{ color: SLATE }}>
        Drop a pin on the map
      </label>
      <div className="mb-3 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <MapPicker value={p.pin} onChange={p.setPin} />
      </div>
      {p.pin && (
        <p className="text-xs mb-3 flex items-center gap-1 font-medium" style={{ color: MINT }}>
          <Check className="w-3.5 h-3.5" /> Location set ({p.pin.lat.toFixed(4)}, {p.pin.lng.toFixed(4)})
        </p>
      )}

      <label className="text-sm font-semibold mb-2" style={{ color: SLATE }}>
        Pickup instructions <span className="text-xs font-normal text-slate-500">(optional)</span>
      </label>
      <textarea
        value={p.locNotes}
        onChange={(e) => p.setLocNotes(e.target.value)}
        rows={2}
        maxLength={200}
        placeholder="e.g. Side door, ring bell…"
        className="bg-white border border-gray-200 rounded-3xl px-4 py-3 outline-none focus:ring-2 transition resize-none w-full"
      />
    </>
  );
}

function ReviewStep(p: {
  category: FoodCategory;
  items: string[];
  desc: string;
  qty: string;
  bestBefore: string;
  packaging: Packaging;
  allergens: string[];
  hygiene: string;
  mins: number;
  pickupArea: string;
  locNotes: string;
  pin: LatLng | null;
}) {
  const cat = FOOD_CATEGORIES.find((c) => c.value === p.category);
  const pkg = PACKAGING_OPTIONS.find((x) => x.value === p.packaging);
  return (
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
          <span className="font-semibold text-slate-900">{cat?.label}</span>
        </div>
      </Row>
      {p.items.length > 0 ? (
        <Row label="What's inside">
          <ul className="list-none space-y-1.5">
            {p.items.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="font-bold mt-0.5" style={{ color: MINT }}>
                  ·
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          {p.desc.trim() && <p className="text-xs text-slate-500 mt-2 border-t border-gray-100 pt-2">{p.desc}</p>}
        </Row>
      ) : (
        <Row label="Description">{p.desc.trim() || "—"}</Row>
      )}
      <Row label="Quantity">{p.qty}</Row>
      {p.bestBefore && <Row label="Best before">{new Date(p.bestBefore).toLocaleString()}</Row>}
      <Row label="Packaging">{pkg?.label}</Row>
      <Row label="Allergens">
        {p.allergens.length === 0 ? (
          <span className="text-slate-500">None reported</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {p.allergens.map((a: string) => (
              <span key={a} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: MINT }}>
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
        <div className="rounded-3xl border border-gray-100 p-3 bg-white overflow-hidden" style={{ boxShadow: shadowCard }}>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Map</div>
          <MapPicker value={p.pin} onChange={() => {}} interactive={false} height={160} />
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-gray-100 p-4 bg-white" style={{ boxShadow: shadowCard }}>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
