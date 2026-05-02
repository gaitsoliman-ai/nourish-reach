import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { TopBar } from "@/components/TopBar";
import { useNima } from "@/context/NimaContext";
import { useLocale } from "@/context/LocaleContext";
import { i18n } from "@/lib/i18n";
import { toast } from "sonner";
import { CheckCircle2, ScanLine, Camera } from "lucide-react";
import { QrScanner } from "@/components/QrScanner";

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
      <TopBar title="Verify pickup" subtitle="Enter PIN or scan QR" />
      <div className="flex-1 flex flex-col px-5 pb-6 overflow-y-auto">
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-6 mb-5 shadow-elevated">
          <ScanLine className="w-8 h-8 mb-2" />
          <h2 className="font-bold text-lg">Confirm the handover</h2>
          <p className="text-sm text-primary-foreground/90">
            Ask the beneficiary to show their 4-digit PIN or scan their QR with your camera.
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground mb-2">{t(i18n.fallback.camera)}</p>

        <button
          type="button"
          onClick={() => setScanning(true)}
          className="w-full mb-4 bg-secondary text-secondary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" /> Scan QR with camera
        </button>

        <div className="flex items-center gap-3 my-2 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or enter PIN <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={submit}>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="e.g. 4827"
            inputMode="text"
            autoFocus
            className="bg-card border border-border rounded-xl px-4 py-4 text-center text-2xl tracking-widest font-bold mb-4 outline-none focus:ring-2 focus:ring-primary transition w-full"
          />
          <button
            type="submit"
            className="w-full bg-gradient-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-elevated active:scale-[0.99] transition"
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
            className={`mt-4 p-4 rounded-xl border animate-scale-in ${
              last.ok
                ? "bg-success/10 border-success/30 text-success"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              {last.message}
            </div>
          </div>
        )}

        <h3 className="font-bold mt-8 mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Awaiting pickup ({pendingForMe.length})
        </h3>
        {pendingForMe.length === 0 ? (
          <p className="text-sm text-muted-foreground">No claimed donations yet.</p>
        ) : (
          <div className="space-y-2">
            {pendingForMe.map((d) => (
              <div key={d.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{d.foodDescription}</p>
                  <p className="text-xs text-muted-foreground">{d.quantity}</p>
                </div>
                <span className="font-mono text-lg font-bold text-primary tracking-widest">
                  {d.pinCode}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
