import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { toast } from "sonner";
import { Clock, MapPin } from "lucide-react";

const PRESETS = [
  { label: "30 min", mins: 30 },
  { label: "1 hr", mins: 60 },
  { label: "2 hrs", mins: 120 },
  { label: "4 hrs", mins: 240 },
];

export default function DonorCreate() {
  const navigate = useNavigate();
  const { donor, createDonation } = useNima();
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [mins, setMins] = useState(60);
  const [customH, setCustomH] = useState("");
  const [customM, setCustomM] = useState("");
  const [pickupArea, setPickupArea] = useState("");

  if (!donor) {
    navigate("/donor/onboarding");
    return null;
  }

  const computeMinutes = () => {
    const h = parseInt(customH || "0", 10) || 0;
    const m = parseInt(customM || "0", 10) || 0;
    const custom = h * 60 + m;
    return custom > 0 ? custom : mins;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !qty.trim()) {
      toast.error("Please fill description and quantity");
      return;
    }
    if (!pickupArea.trim()) {
      toast.error("Please add a pickup area or neighborhood");
      return;
    }
    const totalMins = computeMinutes();
    if (totalMins < 5) {
      toast.error("Pickup window is too short");
      return;
    }
    createDonation({
      foodDescription: desc.trim(),
      quantity: qty.trim(),
      pickupArea: pickupArea.trim(),
      expiresAt: Date.now() + totalMins * 60 * 1000,
    });
    toast.success("Donation posted! People nearby can now see it.");
    navigate("/donor/dashboard");
  };

  const customActive = (parseInt(customH || "0", 10) || 0) + (parseInt(customM || "0", 10) || 0) > 0;

  return (
    <MobileFrame>
      <TopBar title="New donation" subtitle="Quick & simple" onBack={() => navigate("/donor/dashboard")} />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <label className="text-sm font-semibold mb-2">What food is available?</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="e.g. Fresh bread, croissants, sandwiches..."
          className="bg-card border border-border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-primary transition resize-none"
        />

        <label className="text-sm font-semibold mb-2">Quantity</label>
        <input
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="e.g. 10 portions, 5 meals"
          maxLength={60}
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition"
        />

        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Pickup within
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {PRESETS.map((w) => (
            <button
              type="button"
              key={w.mins}
              onClick={() => {
                setMins(w.mins);
                setCustomH("");
                setCustomM("");
              }}
              className={`py-3 rounded-xl text-sm font-medium border transition ${
                !customActive && mins === w.mins
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground">Or set custom:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="relative">
            <input
              type="number"
              min={0}
              max={48}
              value={customH}
              onChange={(e) => setCustomH(e.target.value)}
              placeholder="0"
              className={`w-full bg-card border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition pr-14 ${customActive ? "border-primary" : "border-border"}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">hours</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={59}
              value={customM}
              onChange={(e) => setCustomM(e.target.value)}
              placeholder="0"
              className={`w-full bg-card border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition pr-14 ${customActive ? "border-primary" : "border-border"}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">mins</span>
          </div>
        </div>

        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Pickup area
        </label>
        <input
          value={pickupArea}
          onChange={(e) => setPickupArea(e.target.value)}
          placeholder="e.g. Downtown · Olive Park · Marina"
          maxLength={80}
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-1 outline-none focus:ring-2 focus:ring-primary transition"
        />
        <p className="text-xs text-muted-foreground mb-8">
          Neighborhood or landmark — helps people know if it's near them.
        </p>

        <div className="flex-1" />
        <button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
        >
          Post donation
        </button>
      </form>
    </MobileFrame>
  );
}
