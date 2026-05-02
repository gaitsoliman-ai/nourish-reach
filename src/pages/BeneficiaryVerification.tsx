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
      failKind();
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
    }, 2000);
  };

  if (!isHydrated) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" aria-label="Loading" />
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
      <div className="flex-1 flex flex-col bg-[#F9FAFB] overflow-y-auto">
        <div className="px-5 pt-8 pb-4 text-center border-b border-border/60 bg-white/80 backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            A Community Built on <span className="text-ai">Trust</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
            To ensure these blessings reach those who need them most, please choose a verification method.
          </p>
        </div>

        <div className="flex-1 px-5 py-6 space-y-4">
          {globalError && (
            <div
              role="alert"
              className="rounded-2xl border border-ai/25 bg-ai/5 px-4 py-3 text-sm text-foreground"
            >
              {globalError}
            </div>
          )}

          {/* Option A */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-black/[0.03]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
                  Recommended
                </p>
                <h2 className="font-bold text-foreground text-sm leading-snug">Partner referral</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  I have a referral code from a partner (e.g., Qatar Charity, Red Crescent).
                </p>
              </div>
            </div>
            <form onSubmit={submitReferral} className="space-y-2">
              <input
                value={referral}
                onChange={(e) => {
                  setReferral(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
                  setGlobalError(null);
                }}
                placeholder="6-character code"
                maxLength={6}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-center text-lg font-mono tracking-[0.35em] outline-none focus:ring-2 focus:ring-primary"
                aria-label="Partner referral code"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary text-primary-foreground font-bold py-3.5 shadow-elevated hover:bg-primary/90 active:scale-[0.99] transition"
              >
                Verify with code
              </button>
            </form>
          </section>

          {/* Option B */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-black/[0.03]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-ai/15 text-ai flex items-center justify-center shrink-0">
                <ScanLine className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <h2 className="font-bold text-foreground text-sm leading-snug">Quick ID verification</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  I am a student or worker in need.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 border-l-2 border-primary/40 pl-3">
              We do not store your data. This is a privacy-first instant check.
            </p>
            <button
              type="button"
              onClick={startIdScan}
              disabled={scanning}
              className="w-full rounded-2xl border-2 border-ai/40 bg-ai/5 text-ai font-bold py-3.5 hover:bg-ai/10 active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Simulate ID scan
                </>
              )}
            </button>
          </section>

          {/* Option C */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-soft ring-1 ring-black/[0.03]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <h2 className="font-bold text-foreground text-sm leading-snug">Barakah honor code</h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
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
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-ai text-primary-foreground font-bold py-3.5 shadow-elevated hover:opacity-95 active:scale-[0.99] transition"
            >
              Self-declaration
            </button>
          </section>
        </div>
      </div>

      <AlertDialog open={honorOpen} onOpenChange={setHonorOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Before you continue</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Barakah is built on trust. By continuing, you confirm you are in genuine need of this shared blessing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-xl">Go back</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
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
