import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { useNima } from "@/context/NimaContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HeartHandshake, ScanLine, Shield, Sparkles, Camera, Loader2 } from "lucide-react";

const MINT = "#02db96";
const PURPLE = "#892aff";
const FAIL_CODE = "FAIL00";

export default function BeneficiaryVerification() {
  const navigate = useNavigate();
  const { beneficiary, markBeneficiaryVerified, isHydrated } = useNima();
  const [referral, setReferral] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [honorOpen, setHonorOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (beneficiary?.isVerified) navigate("/beneficiary/home", { replace: true });
  }, [isHydrated, beneficiary?.isVerified, navigate]);

  const finish = () => {
    markBeneficiaryVerified();
    navigate("/beneficiary/home", { replace: true });
  };

  const failKind = () => {
    setGlobalError(
      "Something went wrong. Please try another method or contact support."
    );
  };

  const submitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    const code = referral.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      setGlobalError(
        "Please enter the 6-character code from your partner organization."
      );
      return;
    }
    if (code === FAIL_CODE) {
      failKind();
      return;
    }
    finish();
  };

  const startIdScan = () => {
    setGlobalError(null);
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      finish();
    }, 2200);
  };

  if (!isHydrated) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
          <Loader2
            className="w-10 h-10 animate-spin"
            style={{ color: MINT }}
            aria-label="Loading"
          />
        </div>
      </MobileFrame>
    );
  }

  if (!beneficiary) {
    return (
      <MobileFrame>
        <Navigate to="/" replace />
      </MobileFrame>
    );
  }

  if (beneficiary.isVerified) return null;

  return (
    <MobileFrame>
      <div className="relative flex-1 flex flex-col bg-[#F9FAFB] overflow-y-auto min-h-0">
        <div className="px-5 pt-8 pb-4 text-center border-b border-gray-200/80 bg-white">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
            style={{ backgroundColor: `${MINT}18`, color: MINT }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            A Community Built on Trust
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            To ensure these blessings reach those who need them most, please choose a
            verification method.
          </p>
        </div>

        <div className="flex-1 px-5 py-6 space-y-4 pb-10">
          {globalError && (
            <div
              role="alert"
              className="rounded-2xl border px-4 py-3 text-sm text-slate-800"
              style={{
                borderColor: `${PURPLE}40`,
                backgroundColor: `${PURPLE}0D`,
              }}
            >
              {globalError}
            </div>
          )}

          {/* Option A — Partner Referral */}
          <section
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${MINT}22`, color: MINT }}
              >
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: MINT }}
                >
                  Recommended
                </p>
                <h2 className="font-bold text-slate-900 text-sm leading-snug">
                  Partner Referral (Recommended)
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I have a referral code from a partner (e.g., Qatar Charity, Red
                  Crescent).
                </p>
              </div>
            </div>
            <form onSubmit={submitReferral} className="space-y-2">
              <input
                value={referral}
                onChange={(e) => {
                  setReferral(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
                  );
                  setGlobalError(null);
                }}
                placeholder="6-character code"
                maxLength={6}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-lg font-mono tracking-[0.35em] text-slate-900 outline-none focus:ring-2 focus:ring-[#02db96]/45 focus:ring-offset-0"
                aria-label="Partner referral code"
              />
              <button
                type="submit"
                className="w-full rounded-2xl font-bold py-3.5 text-white shadow-md hover:opacity-95 active:scale-[0.99] transition"
                style={{ backgroundColor: MINT }}
              >
                Verify
              </button>
            </form>
          </section>

          {/* Option B — Quick ID */}
          <section
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${PURPLE}22`, color: PURPLE }}
              >
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <h2 className="font-bold text-slate-900 text-sm leading-snug">
                  Quick ID Verification
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I am a student or worker in need.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3 border-l-2 pl-3 border-[#02db96]/50">
              We do not store your data. This is a privacy-first instant check.
            </p>
            <button
              type="button"
              onClick={startIdScan}
              disabled={scanning}
              className="w-full rounded-2xl border-2 font-bold py-3.5 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                borderColor: `${PURPLE}55`,
                backgroundColor: `${PURPLE}0F`,
                color: PURPLE,
              }}
            >
              {scanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Scan ID
                </>
              )}
            </button>
          </section>

          {/* Option C — Honor Code */}
          <section
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${MINT}22`, color: MINT }}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <h2 className="font-bold text-slate-900 text-sm leading-snug">
                  Barakah Honor Code
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  I am in an immediate crisis and need a meal today.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setGlobalError(null);
                setHonorOpen(true);
              }}
              className="w-full rounded-2xl font-bold py-3.5 text-white shadow-md hover:opacity-95 active:scale-[0.99] transition"
              style={{
                background: `linear-gradient(135deg, ${MINT} 0%, ${PURPLE} 100%)`,
              }}
            >
              Self-declaration
            </button>
          </section>
        </div>

        {/* Simulated camera scan */}
        {scanning && (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/85 px-6"
            role="dialog"
            aria-modal="true"
            aria-label="ID verification scan"
          >
            <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl border-2 overflow-hidden bg-slate-800/50">
              <div
                className="absolute inset-x-0 h-0.5 animate-pulse bg-[#02db96] shadow-[0_0_20px_#02db96]"
                style={{ top: "42%" }}
              />
              <ScanLine
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 text-white/90 animate-pulse"
                aria-hidden
              />
            </div>
            <p className="mt-6 text-center text-sm text-white/90">
              Scanning document… this stays on your device.
            </p>
            <Loader2 className="mt-4 h-8 w-8 animate-spin text-[#02db96]" aria-hidden />
          </div>
        )}
      </div>

      <AlertDialog open={honorOpen} onOpenChange={setHonorOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-slate-900">
              Before you continue
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-slate-600">
              Barakah is built on trust. By continuing, you confirm you are in genuine need
              of this shared blessing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-xl border-gray-200">Go back</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl text-white hover:opacity-95"
              style={{ backgroundColor: MINT }}
              onClick={() => {
                setHonorOpen(false);
                finish();
              }}
            >
              I understand — continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileFrame>
  );
}
