import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TopBar({
  title,
  subtitle,
  onBack,
  right,
  variant = "light",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  variant?: "light" | "primary";
}) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex items-center gap-3 px-5 pt-6 pb-5 ${
        isPrimary ? "bg-gradient-primary text-primary-foreground" : "bg-card text-foreground"
      }`}
    >
      <button
        onClick={handleBack}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
          isPrimary ? "bg-white/20 hover:bg-white/30" : "bg-secondary hover:bg-muted"
        }`}
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-lg truncate">{title}</h1>
        {subtitle && (
          <p className={`text-xs truncate ${isPrimary ? "text-white/80" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
