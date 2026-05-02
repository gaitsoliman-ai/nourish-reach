import { useState, type ReactNode } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import {
  BeneficiaryBottomNav,
  BENEFICIARY_NAV_BOTTOM_PADDING,
} from "@/components/BeneficiaryBottomNav";
import { useNima } from "@/context/NimaContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Bell, Leaf, Shield, UserRound, Wheat } from "lucide-react";

const MINT = "#02db96";
const PURPLE = "#892aff";

export default function BeneficiaryProfile() {
  const { beneficiary, claims } = useNima();
  const [halal, setHalal] = useState(true);
  const [glutenFree, setGlutenFree] = useState(false);
  const [allergies, setAllergies] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const collected = claims.filter(
    (c) => c.beneficiaryId === beneficiary?.id && c.status === "COLLECTED"
  ).length;
  const mealsRescued = collected > 0 ? collected * 3 + 3 : 12;
  const co2Kg = collected > 0 ? Math.max(2, Math.round(mealsRescued * 0.42)) : 5;

  return (
    <MobileFrame>
      <div
        className={`flex flex-1 flex-col min-h-0 bg-[#F9FAFB] ${BENEFICIARY_NAV_BOTTOM_PADDING}`}
      >
        <div className="shrink-0 bg-white px-6 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] shadow-sm shadow-slate-900/5">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-inner"
              aria-hidden
            >
              <UserRound className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
            </div>
            <h1 className="mt-4 text-xl font-bold text-slate-900">Anonymous User</h1>
            <p className="mt-1 text-sm text-gray-500">Your dignity stays protected</p>
          </div>

          <div
            className="mt-6 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-white shadow-lg"
            style={{
              background: `linear-gradient(125deg, ${PURPLE} 0%, #6d21cc 100%)`,
              boxShadow: `0 12px 32px -8px ${PURPLE}55`,
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/85">
                Trust
              </p>
              <p className="text-sm font-semibold leading-snug">
                ✓ Verified by Qatar Charity Partner Code
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Your impact
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Leaf className="h-4 w-4" style={{ color: MINT }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    Meals rescued
                  </span>
                </div>
                <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">{mealsRescued}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-lg" aria-hidden>
                    🌍
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide">
                    CO₂ saved
                  </span>
                </div>
                <p className="mt-2 text-3xl font-black tabular-nums text-slate-900">
                  {co2Kg}
                  <span className="text-lg font-bold text-gray-500">kg</span>
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-50">
            <h2 className="border-b border-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Dietary preferences
            </h2>
            <SettingRow
              id="pref-halal"
              icon={<Leaf className="h-4 w-4" style={{ color: MINT }} />}
              label="Halal preferred"
              checked={halal}
              onCheckedChange={setHalal}
            />
            <SettingRow
              id="pref-gluten"
              icon={<Wheat className="h-4 w-4 text-amber-600" />}
              label="Gluten-free"
              checked={glutenFree}
              onCheckedChange={setGlutenFree}
            />
            <SettingRow
              id="pref-allergies"
              icon={<Shield className="h-4 w-4 text-gray-500" />}
              label="Allergy-safe matches"
              description="Prioritize listings with allergen notes"
              checked={allergies}
              onCheckedChange={setAllergies}
              last
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-50">
            <h2 className="border-b border-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Notifications
            </h2>
            <SettingRow
              id="pref-notify"
              icon={<Bell className="h-4 w-4 text-gray-500" />}
              label="Pickup reminders & new meals nearby"
              checked={notifications}
              onCheckedChange={setNotifications}
              last
            />
          </section>
        </div>
      </div>

      <BeneficiaryBottomNav />
    </MobileFrame>
  );
}

function SettingRow({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  last,
}: {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3.5",
        !last && "border-b border-gray-50"
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <Label htmlFor={id} className="text-sm font-semibold text-slate-800">
            {label}
          </Label>
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-[#02db96]"
      />
    </div>
  );
}
