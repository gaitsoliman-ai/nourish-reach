import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { toast } from "sonner";

const TYPES = ["Bakery", "Restaurant", "Café", "Hotel", "Grocery", "Catering", "Other"];

export default function DonorOnboarding() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Restaurant");
  const { registerDonor } = useNima();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a business name");
      return;
    }
    registerDonor(name.trim(), type);
    toast.success(`Welcome, ${name.trim()} 👋`);
    navigate("/donor/dashboard");
  };

  return (
    <MobileFrame>
      <TopBar title="Become a donor" subtitle="Two quick details" onBack={() => navigate("/")} />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-6 shadow-elevated">
          <Store className="w-8 h-8 mb-3" />
          <h2 className="text-xl font-bold mb-1">Turn surplus into impact</h2>
          <p className="text-sm opacity-90">It takes 30 seconds. No paperwork.</p>
        </div>

        <label className="text-sm font-semibold mb-2">Business name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Boulangerie Al-Noor"
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition"
        />

        <label className="text-sm font-semibold mb-2">Business type</label>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`py-3 rounded-xl text-sm font-medium border transition ${
                type === t
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card border-border text-foreground hover:border-primary/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1" />
        <button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
        >
          Continue
        </button>
      </form>
    </MobileFrame>
  );
}
