import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { useLocale } from "@/context/LocaleContext";
import { i18n } from "@/lib/i18n";
import { toast } from "sonner";

export default function DonorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginDonor } = useNima();
  const { t } = useLocale();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginDonor(username, password);
    if (!res.ok) {
      toast.error(res.message || t(i18n.errors.login));
      return;
    }
    toast.success("Welcome back 👋");
    navigate("/donor/dashboard");
  };

  return (
    <MobileFrame>
      <TopBar title="Log in" subtitle="Donor account" onBack={() => navigate("/")} />
      <form onSubmit={submit} className="flex-1 flex flex-col px-5 pb-6">
        <div className="rounded-2xl p-6 mb-6 bg-gradient-primary text-primary-foreground shadow-elevated">
          <LogIn className="w-8 h-8 mb-3" />
          <h2 className="text-xl font-bold mb-1">Welcome back</h2>
          <p className="text-sm opacity-90">Pick up where your team left off.</p>
        </div>

        <label className="text-sm font-semibold mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
          placeholder="your username"
          autoCapitalize="none"
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-4 outline-none focus:ring-2 focus:ring-primary transition"
        />

        <label className="text-sm font-semibold mb-2">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="your password"
          className="bg-card border border-border rounded-xl px-4 py-3.5 mb-6 outline-none focus:ring-2 focus:ring-primary transition"
        />

        <button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
        >
          Log in
        </button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          New here?{" "}
          <Link to="/donor/onboarding" className="text-primary font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </MobileFrame>
  );
}
