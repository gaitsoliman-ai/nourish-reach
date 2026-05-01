import { Navigate, Outlet } from "react-router-dom";
import { useNima } from "@/context/NimaContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function ProtectedBeneficiaryRoute() {
  const { isHydrated, beneficiary } = useNima();

  if (!isHydrated) return <LoadingSpinner />;

  if (!beneficiary) return <Navigate to="/" replace />;

  return <Outlet />;
}
