import { Link, useNavigate } from "react-router-dom";
import { Heart, Store, Sparkles, ShieldCheck } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";

const Index = () => {
  const navigate = useNavigate();
  const { generateBeneficiary, donor, beneficiary } = useNima();

  const onNeedFood = () => {
    if (!beneficiary) generateBeneficiary();
    navigate("/beneficiary/home");
  };

  const onDonate = () => {
    if (donor) navigate("/donor/dashboard");
    else navigate("/donor/onboarding");
  };

  const onLogin = () => navigate("/donor/login");

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-warning/30 rounded-full blur-3xl" />

        <div className="relative flex-1 flex flex-col px-7 pt-16 pb-8">
          <div className="flex items-center gap-2 mb-2 animate-fade-in">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide opacity-90">Anonymous · Dignified · Fast</span>
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-1 animate-slide-up">Ni'ma</h1>
          <p className="text-xl font-light opacity-90 mb-1 animate-slide-up">نِعمة</p>
          <p className="text-base opacity-90 max-w-xs leading-relaxed mt-4 animate-slide-up">
            A blessing shared. Rescue surplus food, preserve dignity, fight waste — together.
          </p>

          <div className="flex-1" />

          <div className="space-y-3 animate-slide-up">
            <button
              onClick={onNeedFood}
              className="w-full bg-white text-foreground font-bold text-lg py-5 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition flex items-center justify-center gap-3"
            >
              <Heart className="w-6 h-6 text-primary" />
              Find a Meal
            </button>
            <button
              onClick={onDonate}
              className="w-full bg-white/15 backdrop-blur border border-white/30 text-white font-bold text-lg py-5 rounded-2xl hover:bg-white/25 active:scale-[0.99] transition flex items-center justify-center gap-3"
            >
              <Store className="w-6 h-6" />
              I Want to Donate
            </button>
          </div>

          {!donor && (
            <button
              onClick={onLogin}
              className="mt-3 text-sm text-white/90 underline underline-offset-4 hover:text-white transition"
            >
              Already a donor? Log in
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mt-6 text-xs opacity-80">
            <ShieldCheck className="w-4 h-4" />
            <span>No signup required for beneficiaries</span>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Index;
