import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { StepIndicator } from "@/components/StepIndicator";
import { Globe, Handshake, Users, MapPin, BookOpen, HeartPulse, Briefcase, LifeBuoy } from "lucide-react";
import { MINT, SLATE, SOFT_MINT, shadowCard } from "@/lib/barakahDesign";

const AREAS = [
  { icon: BookOpen, label: "Education" },
  { icon: HeartPulse, label: "Health" },
  { icon: Briefcase, label: "Livelihood" },
  { icon: LifeBuoy, label: "Emergency Relief" },
];

export default function BeneficiaryPartnerQatar() {
  return (
    <MobileFrame>
      <div className={`flex flex-1 flex-col min-h-0 bg-[#fafafa] ${BENEFICIARY_NAV_BOTTOM_PADDING}`}>
        <header className="shrink-0 bg-white px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6faf4]">
                <span className="text-lg font-black text-[#0A4D3C]">B</span>
              </div>
              <div>
                <p className="font-black text-sm leading-tight" style={{ color: SLATE }}>
                  Barakah
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#02db96]">Receiver</p>
              </div>
            </div>
          </div>
          <StepIndicator current={4} total={4} />
          <p className="text-center text-xs font-bold mt-3 uppercase tracking-wide" style={{ color: MINT }}>
            Step 4: Verified Impact
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden" style={{ boxShadow: shadowCard }}>
            <div className="px-6 pt-8 pb-4 text-center border-b border-gray-50">
              <div className="mx-auto h-20 w-20 rounded-full bg-[#7f1d1d] flex items-center justify-center text-white text-3xl font-black mb-3 shadow-md">
                Q
              </div>
              <h1 className="text-xl font-bold" style={{ color: SLATE }}>
                Qatar Charity
              </h1>
              <p className="text-sm text-slate-500">Humanitarian Organization</p>
              <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Doha, Qatar
              </p>
            </div>

            <div className="p-4">
              <div
                className="rounded-3xl border border-[#02db96]/25 px-4 py-3 flex items-start gap-3"
                style={{ backgroundColor: SOFT_MINT }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                    <path fill={MINT} d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v8.14l-6 3.75-6-3.75V7.93l6-3.75z" />
                    <path fill="white" d="M10.2 14.4l-2.1-2.1 1.06-1.06 1.04 1.04 3.54-3.54 1.06 1.06z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-bold text-sm" style={{ color: MINT }}>
                    Verified Partner
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    This organization is a verified partner of Qatar Charity.
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-[#7f1d1d] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  Q
                </div>
              </div>

              <h2 className="mt-6 font-bold text-slate-900">About</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Qatar Charity delivers humanitarian aid and sustainable development across education, health,
                and emergency response — strengthening dignity for millions.
              </p>
              <button type="button" className="mt-2 text-sm font-bold" style={{ color: MINT }}>
                Read more &gt;
              </button>

              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="rounded-2xl bg-[#f8fafc] p-3 text-center border border-gray-100">
                  <Users className="h-5 w-5 mx-auto mb-1" style={{ color: MINT }} />
                  <p className="text-lg font-black tabular-nums" style={{ color: MINT }}>
                    4.2M+
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Beneficiaries</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-3 text-center border border-gray-100">
                  <Globe className="h-5 w-5 mx-auto mb-1" style={{ color: MINT }} />
                  <p className="text-lg font-black tabular-nums" style={{ color: MINT }}>
                    70+
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Countries</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-3 text-center border border-gray-100">
                  <Handshake className="h-5 w-5 mx-auto mb-1" style={{ color: MINT }} />
                  <p className="text-lg font-black tabular-nums" style={{ color: MINT }}>
                    1,200+
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Projects</p>
                </div>
              </div>

              <h2 className="mt-6 font-bold text-slate-900">Areas of Work</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 mt-3 -mx-1 px-1 scrollbar-none">
                {AREAS.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm"
                  >
                    <Icon className="h-4 w-4" style={{ color: MINT }} />
                    <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BeneficiaryBottomNav />
    </MobileFrame>
  );
}
