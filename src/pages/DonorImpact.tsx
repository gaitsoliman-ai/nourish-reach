import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  ArrowLeft,
  Share2,
  TrendingUp,
  Award,
  Globe2,
  Sprout,
  TreePine,
} from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { MINT, SLATE, SOFT_MINT, SUNSET, shadowCard } from "@/lib/barakahDesign";
import { cn } from "@/lib/utils";

export default function DonorImpact() {
  const navigate = useNavigate();
  const { donor, donations } = useNima();

  const mine = donations.filter((d) => d.donorId === donor?.id);
  const collected = mine.filter((d) => d.status === "COLLECTED").length;
  
  // Fake stats based on collected items
  const mealsRescued = collected * 5 + 10;
  const co2Saved = mealsRescued * 2.5; // kg
  const waterSaved = mealsRescued * 105; // liters
  
  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 min-h-0 bg-[#fafafa]">
        {/* Header */}
        <header className="shrink-0 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-6 bg-gradient-hero rounded-b-[2.5rem] relative overflow-hidden" style={{ boxShadow: shadowCard }}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0" />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition active:scale-95 hover:bg-white/30 border border-white/30"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="text-white font-bold tracking-widest text-xs uppercase opacity-90">
              Your Impact
            </p>
            <button
              onClick={() => {}}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition active:scale-95 hover:bg-white/30 border border-white/30"
              aria-label="Share impact"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="relative z-10 text-center mb-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 mb-4 shadow-lg">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              {mealsRescued} <span className="text-xl font-medium opacity-80">meals</span>
            </h1>
            <p className="text-white/80 text-sm max-w-[240px] mx-auto font-medium leading-relaxed">
               rescued from waste and provided to those who need it most.
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-10 -mt-6 z-20 relative">
          
          {/* Level Progress */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 mb-5" style={{ boxShadow: shadowCard }}>
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
              <Award className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-2">
                <h3 className="font-bold text-slate-800 text-sm">Community Hero</h3>
                <p className="text-[10px] font-bold text-slate-400">LEVEL 3</p>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-warm w-[65%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">
                15 meals until Level 4
              </p>
            </div>
          </div>

          {/* Environmental Metrics */}
          <h2 className="font-bold text-lg mb-4 mt-2" style={{ color: SLATE }}>Environmental Impact</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-start" style={{ boxShadow: shadowCard }}>
              <div className="h-10 w-10 rounded-full bg-[#f0f9ff] text-sky-500 flex items-center justify-center mb-3">
                <Globe2 className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-slate-800 tabular-nums">
                {co2Saved.toFixed(1)} <span className="text-sm font-semibold opacity-50">kg</span>
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1 text-left">
                CO₂ Emissions Avoided
              </p>
            </div>
            <div className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-start" style={{ boxShadow: shadowCard }}>
              <div className="h-10 w-10 rounded-full bg-[#eff6ff] text-blue-500 flex items-center justify-center mb-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-2xl font-black text-slate-800 tabular-nums">
                {waterSaved.toFixed(0)} <span className="text-sm font-semibold opacity-50">L</span>
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1 text-left">
                Water Preserved
              </p>
            </div>
          </div>

          {/* Social Proof / Milestone */}
          <div 
             className="rounded-3xl p-6 relative overflow-hidden text-white shadow-lg"
             style={{ background: `linear-gradient(135deg, ${MINT}, #01b87d)` }}
          >
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
              <TreePine className="w-48 h-48" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 border border-white/30">
                 <TrendingUp className="h-6 w-6 text-white" />
               </div>
               <div>
                 <h3 className="font-bold text-lg mb-1 leading-tight">Top 5% of Donors!</h3>
                 <p className="text-sm font-medium text-white/90 leading-relaxed mb-4">
                   Your generosity this month has placed you among the top contributors in your city.
                 </p>
                 <button className="text-sm font-bold bg-white text-emerald-700 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition active:scale-95">
                   Share Milestone
                 </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </MobileFrame>
  );
}
