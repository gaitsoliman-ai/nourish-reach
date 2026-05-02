import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Radar, Home, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const MINT = "#02db96";

const tabs = [
  { path: "/beneficiary/home", label: "Home", Icon: Home },
  { path: "/beneficiary/explore", label: "Location Radar", Icon: Radar },
  { path: "/beneficiary/activity", label: "My Blessings", Icon: Heart },
  { path: "/beneficiary/profile", label: "Profile", Icon: UserRound },
] as const;

function pathMatches(pathname: string, target: string) {
  return pathname === target || pathname.endsWith(target);
}

export function BeneficiaryBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-gray-100 bg-white px-2 pt-2 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.06)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Main navigation"
    >
      {tabs.map(({ path, label, Icon }) => {
        const active = pathMatches(pathname, path);
        return (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors",
              active ? "" : "text-gray-400"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className="w-6 h-6"
              strokeWidth={active ? 2.25 : 1.75}
              style={active ? { color: MINT } : undefined}
            />
            <span
              className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}
              style={active ? { color: MINT } : undefined}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Bottom padding so fixed nav does not cover content (matches nav height). */
export const BENEFICIARY_NAV_BOTTOM_PADDING =
  "pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]";
