import { Navigate, Outlet } from "react-router-dom";
import { useNima } from "@/context/NimaContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function ProtectedDonorRoute() {
  const { isHydrated, donor } = useNima();

  if (!isHydrated) return <LoadingSpinner />;

  if (!donor) return <Navigate to="/donor/onboarding" replace />;

  return <Outlet />;
}
