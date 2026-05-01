import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const WINDOWS = [
  { label: "30 min", mins: 30 },
  { label: "1 hour", mins: 60 },
  { label: "2 hours", mins: 120 },
  { label: "4 hours", mins: 240 },
];

export default function DonorCreate() {
  const navigate = useNavigate();
  const { donor, createDonation } = useNima();
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState("");
  const [mins, setMins] = useState(60);
  const [distance, setDistance] = useState(0.5);

  if (!donor) {
    navigate("/donor/onboarding");
    return null;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !qty.trim()) {
      toast.error("Please fill description and quantity");
      return;
    }
    createDonation({
      foodDescription: desc.trim(),
      quantity: qty.trim(),
      distanceKm: distance,
      expiresAt: Date.now() + mins * 60 * 1000,
    });
    toast.success("Donation posted! Beneficiaries can now see it.");
    navigate("/donor/dashboard");
  };

  return (
    <MobileFrame>
      <TopBar title="New donation" subtitle="Quick & simple" />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <label className="text-sm font-semibold mb-2">What food is available?</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          placeholder="e.g. Fresh bread, croissants, sandwiches..."
          className="bg-card border border-border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-primary transition resize-none"
        />

        <label className="text-sm font-semibold mb-2">Quantity</label>
        <input
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="e.g. 10 portions, 5 meals"
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition"
        />

        <label className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Pickup within
        </label>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {WINDOWS.map((w) => (
            <button
              type="button"
              key={w.mins}
              onClick={() => setMins(w.mins)}
              className={`py-3 rounded-xl text-sm font-medium border transition ${
                mins === w.mins
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-semibold mb-2">
          Approx. distance hint:{" "}
          <span className="text-primary font-bold">{distance.toFixed(1)} km</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.1}
          value={distance}
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          className="w-full accent-primary mb-8"
        />

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
