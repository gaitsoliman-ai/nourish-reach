import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Heart } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima, DonorKind } from "@/context/NimaContext";
import { toast } from "sonner";

const TYPES = ["Bakery", "Restaurant", "Café", "Hotel", "Grocery", "Catering", "Other"];

export default function DonorOnboarding() {
  const [kind, setKind] = useState<DonorKind>("BUSINESS");
  const [name, setName] = useState("");
  const [type, setType] = useState("Restaurant");
  const [phone, setPhone] = useState("");
  const { registerDonor } = useNima();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(kind === "BUSINESS" ? "Please enter a business name" : "Please enter your name");
      return;
    }
    if (kind === "BUSINESS") {
      registerDonor(name.trim(), type, "BUSINESS");
    } else {
      registerDonor(name.trim(), "Individual", "INDIVIDUAL", phone.trim() || undefined);
    }
    toast.success(`Welcome, ${name.trim()} 👋`);
    navigate("/donor/dashboard");
  };

  const isBiz = kind === "BUSINESS";

  return (
    <MobileFrame>
      <TopBar title="Become a donor" subtitle="Two quick details" onBack={() => navigate("/")} />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <div className={`rounded-2xl p-6 mb-6 shadow-elevated text-primary-foreground ${isBiz ? "bg-gradient-primary" : "bg-gradient-trust"}`}>
          {isBiz ? <Store className="w-8 h-8 mb-3" /> : <Heart className="w-8 h-8 mb-3" />}
          <h2 className="text-xl font-bold mb-1">
            {isBiz ? "Turn surplus into impact" : "Share a meal, share kindness"}
          </h2>
          <p className="text-sm opacity-90">
            {isBiz ? "It takes 30 seconds. No paperwork." : "Even one extra plate can change someone's day."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setKind("BUSINESS")}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              isBiz ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            🏪 Business
          </button>
          <button
            type="button"
            onClick={() => setKind("INDIVIDUAL")}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              !isBiz ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
            }`}
          >
            💛 Individual
          </button>
        </div>

        <label className="text-sm font-semibold mb-2">
          {isBiz ? "Business name" : "Your name (or nickname)"}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isBiz ? "e.g. Boulangerie Al-Noor" : "e.g. Sara"}
          maxLength={60}
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition"
        />

        {isBiz ? (
          <>
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
          </>
        ) : (
          <>
            <label className="text-sm font-semibold mb-2">
              Phone number <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="So we can reach you about pickup"
              maxLength={30}
              className="bg-card border border-border rounded-xl px-4 py-3.5 mb-3 outline-none focus:ring-2 focus:ring-primary transition"
            />
            <p className="text-xs text-muted-foreground mb-8">
              Only shared with the person picking up — never publicly shown.
            </p>
          </>
        )}

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
