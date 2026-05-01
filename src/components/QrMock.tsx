import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Real, scannable QR code generated client-side from `value`.
 * Uses the `qrcode` library so any phone camera or QR scanner can read it.
 */
export function QrMock({ value, size = 220 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size * 2, // crisp on retina
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0F172A", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <div className="bg-white p-3 rounded-2xl shadow-soft inline-block">
      {dataUrl ? (
        <img
          src={dataUrl}
          width={size}
          height={size}
          alt="Pickup QR code"
          style={{ display: "block", imageRendering: "pixelated" }}
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-muted animate-pulse rounded-lg"
        />
      )}
    </div>
  );
}
