import { useNavigate } from "react-router-dom";
import { Heart, Store, Sparkles, ShieldCheck } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { useLocale } from "@/context/LocaleContext";

const Index = () => {
  const navigate = useNavigate();
  const { generateBeneficiary, donor, beneficiary } = useNima();
  const { locale, setLocale } = useLocale();

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
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/12 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-primary/25 rounded-full blur-3xl" />

        {/* Hero collage */}
        <div className="absolute inset-x-0 top-0 h-72 opacity-40 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=70&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary" />
        </div>

        <div className="relative flex-1 flex flex-col px-7 pt-14 pb-8">
          <div className="flex items-center gap-2 mb-2 animate-fade-in">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide opacity-90">Anonymous · Dignified · Fast</span>
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-1 animate-slide-up">Barakah</h1>
          <p className="text-xl font-light opacity-90 mb-1 animate-slide-up">بركة</p>
          <p className="text-base opacity-95 max-w-xs leading-relaxed mt-3 animate-slide-up">
            A blessing shared. Rescue surplus food, preserve dignity, fight waste — together.
          </p>

          {/* Live photo strip */}
          <div className="flex gap-2 mt-5 animate-slide-up">
            {[
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=70&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=70&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=70&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=70&auto=format&fit=crop",
            ].map((src, i) => (
              <div
                key={i}
                className="flex-1 aspect-square rounded-xl overflow-hidden ring-2 ring-white/40 shadow-lg"
              >
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>

          {/* Social-proof stats */}
          <div className="grid grid-cols-3 gap-2 mt-5 animate-slide-up">
            {[
              { n: "1,284", l: "Meals saved" },
              { n: "62", l: "Donors" },
              { n: "Doha", l: "Live now" },
            ].map((s) => (
              <div key={s.l} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-lg font-bold leading-none">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wide opacity-90 mt-1">{s.l}</div>
              </div>
            ))}
          </div>

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

          <div className="flex items-center justify-center gap-2 mt-6 text-xs opacity-90">
            <ShieldCheck className="w-4 h-4" />
            <span>No signup required for beneficiaries</span>
          </div>

          <div className="flex justify-center gap-3 mt-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={locale === "en" ? "text-white underline" : "text-white/70"}
            >
              English
            </button>
            <span className="text-white/40">|</span>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className={locale === "ar" ? "text-white underline" : "text-white/70"}
            >
              العربية
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Index;
