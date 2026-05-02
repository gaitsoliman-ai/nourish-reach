import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import { useLocale } from "@/context/LocaleContext";
import { i18n } from "@/lib/i18n";
import { toast } from "sonner";
import { CheckCircle2, ScanLine, Camera, ArrowLeft, Lock } from "lucide-react";
import { QrScanner } from "@/components/QrScanner";
import { StepIndicator, StepHeader } from "@/components/StepIndicator";
import { MINT, SLATE, shadowCard } from "@/lib/barakahDesign";

export default function DonorVerify() {
  const { verifyPickup, donor, donations } = useNima();
  const { t } = useLocale();
  const [pin, setPin] = useState("");
  const [last, setLast] = useState<{ ok: boolean; message: string } | null>(null);
  const [scanning, setScanning] = useState(false);

  const pendingForMe = donations.filter((d) => d.donorId === donor!.id && d.status === "CLAIMED");

  const runVerify = (code: string) => {
    const res = verifyPickup(code);
    setLast(res);
    if (res.ok) {
      toast.success(res.message);
      setPin("");
    } else {
      toast.error(res.message);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    runVerify(pin);
  };

  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 min-h-0 bg-[#fafafa]">
        <header className="shrink-0 bg-white px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 text-[#0A4D3C]" aria-label="Back">
              <ArrowLeft className="h-5 w-5" style={{ color: MINT }} />
            </button>
            <div className="flex-1 text-center pr-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">barakah</p>
              <p className="text-xs font-black text-slate-900">Donor App</p>
            </div>
          </div>
          <StepIndicator current={4} total={4} />
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <StepHeader
            step={4}
            total={4}
            title="Verify Pickup"
            subtitle="Ask the recipient to show their QR code to verify the pickup."
          />

          <div
            className="rounded-3xl bg-white border border-gray-100 p-6 mb-6 flex flex-col items-center"
            style={{ boxShadow: shadowCard }}
          >
            <div className="relative mx-auto mb-4">
              <div className="grid grid-cols-11 gap-[2px] p-3 bg-white rounded-xl border border-gray-100">
                {Array.from({ length: 121 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-[1px] ${i % 3 === 0 || (i + i / 11) % 4 === 0 ? "bg-slate-900" : "bg-white"}`}
                  />
                ))}
              </div>
              <span className="pointer-events-none absolute -left-1 -top-1 h-7 w-7 border-l-[3px] border-t-[3px] rounded-tl-lg border-[#02db96]" />
              <span className="pointer-events-none absolute -right-1 -top-1 h-7 w-7 border-r-[3px] border-t-[3px] rounded-tr-lg border-[#02db96]" />
              <span className="pointer-events-none absolute -left-1 -bottom-1 h-7 w-7 border-l-[3px] border-b-[3px] rounded-bl-lg border-[#02db96]" />
              <span className="pointer-events-none absolute -right-1 -bottom-1 h-7 w-7 border-r-[3px] border-b-[3px] rounded-br-lg border-[#02db96]" />
            </div>
            <div className="flex items-start gap-3 text-left w-full max-w-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6faf4]">
                <Lock className="h-5 w-5" style={{ color: MINT }} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                This helps ensure a secure and safe handoff.
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500 mb-3">{t(i18n.fallback.camera)}</p>

          <button
            type="button"
            onClick={() => setScanning(true)}
            className="w-full mb-5 font-bold py-4 rounded-3xl text-white shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] transition"
            style={{ backgroundColor: MINT }}
          >
            <Camera className="w-5 h-5" /> Scan to Complete
          </button>

          <div className="flex items-center gap-3 my-4 text-xs text-slate-400">
            <div className="flex-1 h-px bg-gray-200" /> or enter PIN <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={submit}>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g. 4827"
              inputMode="text"
              className="bg-white border border-gray-200 rounded-3xl px-4 py-4 text-center text-2xl tracking-widest font-bold mb-4 outline-none focus:ring-2 w-full"
              style={{ ["--tw-ring-color" as string]: `${MINT}55`, color: SLATE }}
            />
            <button
              type="submit"
              className="w-full font-bold py-4 rounded-3xl text-white shadow-md active:scale-[0.99] transition border border-transparent"
              style={{ backgroundColor: MINT }}
            >
              Confirm pickup
            </button>
          </form>

          {scanning && (
            <QrScanner
              onClose={() => setScanning(false)}
              onResult={(text) => {
                setScanning(false);
                runVerify(text);
              }}
            />
          )}

          {last && (
            <div
              className={`mt-5 p-4 rounded-3xl border animate-scale-in ${
                last.ok ? "bg-[#e6faf4] border-[#02db96]/30 text-[#0A4D3C]" : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                {last.message}
              </div>
            </div>
          )}

          {pendingForMe.length > 0 && (
            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-4 text-sm text-slate-600" style={{ boxShadow: shadowCard }}>
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <ScanLine className="w-4 h-4" style={{ color: MINT }} />
                Waiting on you
              </div>
              <ul className="space-y-2">
                {pendingForMe.map((d) => (
                  <li key={d.id} className="flex justify-between text-xs">
                    <span className="truncate mr-2">{d.businessName}</span>
                    <span className="font-mono font-bold text-[#02db96]">PIN {d.pinCode}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </MobileFrame>
  );
}
