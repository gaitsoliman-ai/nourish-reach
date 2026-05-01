import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X } from "lucide-react";

/**
 * Live camera QR scanner. Calls onResult with the decoded text.
 * Uses html5-qrcode which works in modern mobile browsers (requires camera permission).
 */
export function QrScanner({
  onResult,
  onClose,
}: {
  onResult: (text: string) => void;
  onClose: () => void;
}) {
  const elId = "nima-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    let active = true;
    const scanner = new Html5Qrcode(elId, { verbose: false });
    scannerRef.current = scanner;

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (handledRef.current) return;
            handledRef.current = true;
            onResult(decoded);
          },
          () => {}
        );
      } catch (e: any) {
        if (active) setError(e?.message || "Could not access camera");
      }
    };
    start();

    return () => {
      active = false;
      const s = scannerRef.current;
      if (s) {
        s.stop()
          .then(() => s.clear())
          .catch(() => {});
      }
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          <span className="font-semibold">Scan beneficiary QR</span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-black relative ring-2 ring-white/20">
          <div id={elId} className="w-full h-full" />
          <div className="pointer-events-none absolute inset-6 border-2 border-white/70 rounded-xl" />
        </div>
      </div>
      <div className="p-5 text-center text-white/80 text-sm">
        {error ? (
          <span className="text-destructive-foreground bg-destructive/40 px-3 py-2 rounded-lg inline-block">
            {error}
          </span>
        ) : (
          "Point your camera at the beneficiary's QR code"
        )}
      </div>
    </div>
  );
}
