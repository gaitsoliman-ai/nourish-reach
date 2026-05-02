/** Mint teardrop pin with Barakah star (Receiver radar) */
export function BarakahMapPin({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 48"
      width="40"
      height="48"
      aria-hidden
    >
      <path
        d="M20 2C12.82 2 7 7.59 7 14.25c0 8.5 13 21.75 13 21.75S33 22.75 33 14.25C33 7.59 27.18 2 20 2z"
        fill="#02db96"
        stroke="#0A4D3C"
        strokeWidth="1"
      />
      <path
        fill="white"
        d="M20 12 L22 18 L28 20 L22 22 L20 28 L18 22 L12 20 L18 18 Z"
      />
    </svg>
  );
}
