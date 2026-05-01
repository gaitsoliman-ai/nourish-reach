import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { registerDonor } = useNima();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(kind === "BUSINESS" ? "Please enter a business name" : "Please enter your name");
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      toast.error("Pick a username (3+ characters)");
      return;
    }
    if (!password || password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    const res = registerDonor(
      name.trim(),
      kind === "BUSINESS" ? type : "Individual",
      username,
      password,
      kind,
      phone.trim() || undefined
    );
    if (!res.ok) {
      toast.error(res.message || "Could not create account");
      return;
    }
    toast.success(`Welcome, ${name.trim()} 👋`);
    navigate("/donor/dashboard");
  };

  const isBiz = kind === "BUSINESS";

  return (
    <MobileFrame>
      <TopBar title="Create donor account" subtitle="Quick — no paperwork" onBack={() => navigate("/")} />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <div className={`rounded-2xl p-6 mb-6 shadow-elevated text-primary-foreground ${isBiz ? "bg-gradient-primary" : "bg-gradient-trust"}`}>
          {isBiz ? <Store className="w-8 h-8 mb-3" /> : <Heart className="w-8 h-8 mb-3" />}
          <h2 className="text-xl font-bold mb-1">
            {isBiz ? "Turn surplus into impact" : "Share a meal, share kindness"}
          </h2>
          <p className="text-sm opacity-90">
            {isBiz
              ? "Share login with your team — everyone sees the same donations."
              : "Even one extra plate can change someone's day."}
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

        {isBiz && (
          <>
            <label className="text-sm font-semibold mb-2">Business type</label>
            <div className="grid grid-cols-3 gap-2 mb-5">
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
        )}

        {!isBiz && (
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
              className="bg-card border border-border rounded-xl px-4 py-3.5 mb-5 outline-none focus:ring-2 focus:ring-primary transition"
            />
          </>
        )}

        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wide">
            Account login {isBiz && "· share with your team"}
          </p>
          <label className="text-sm font-semibold mb-2 block">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            placeholder="e.g. alnoor_bakery"
            maxLength={30}
            autoCapitalize="none"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-primary transition"
          />
          <label className="text-sm font-semibold mb-2 block">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Pick something easy to remember"
            maxLength={60}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary transition"
          />
          <p className="text-[11px] text-muted-foreground mt-2">
            Anyone on your team can log in with this — they'll all see and add to the same donations.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
        >
          Create account
        </button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/donor/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </MobileFrame>
  );
}
