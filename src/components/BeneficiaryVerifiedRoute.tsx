import { Navigate, Outlet } from "react-router-dom";
import { useNima } from "@/context/NimaContext";

/** Requires `beneficiary.isVerified` before home / QR. */
export function BeneficiaryVerifiedRoute() {
  const { beneficiary } = useNima();

  if (!beneficiary?.isVerified) {
    return <Navigate to="/beneficiary/verify" replace />;
  }

  return <Outlet />;
}
