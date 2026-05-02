import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DonorOnboarding from "./pages/DonorOnboarding.tsx";
import DonorLogin from "./pages/DonorLogin.tsx";
import DonorDashboard from "./pages/DonorDashboard.tsx";
import DonorCreate from "./pages/DonorCreate.tsx";
import DonorVerify from "./pages/DonorVerify.tsx";
import DonorProfile from "./pages/DonorProfile.tsx";
import BeneficiaryHome from "./pages/BeneficiaryHome.tsx";
import BeneficiaryQR from "./pages/BeneficiaryQR.tsx";
import BeneficiaryVerification from "./pages/BeneficiaryVerification.tsx";
import { NimaProvider } from "./context/NimaContext.tsx";
import { LocaleProvider } from "./context/LocaleContext.tsx";
import { ProtectedDonorRoute } from "./components/ProtectedDonorRoute.tsx";
import { ProtectedBeneficiaryRoute } from "./components/ProtectedBeneficiaryRoute.tsx";
import { BeneficiaryVerifiedRoute } from "./components/BeneficiaryVerifiedRoute.tsx";

const queryClient = new QueryClient();

/** Matches `vite.config` / `--base`; required for GitHub Pages project URLs. */
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") === "" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NimaProvider>
        <LocaleProvider>
          <BrowserRouter basename={routerBasename}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/donor/onboarding" element={<DonorOnboarding />} />
              <Route path="/donor/login" element={<DonorLogin />} />
              <Route element={<ProtectedDonorRoute />}>
                <Route path="/donor/dashboard" element={<DonorDashboard />} />
                <Route path="/donor/create" element={<DonorCreate />} />
                <Route path="/donor/verify" element={<DonorVerify />} />
                <Route path="/donor/profile" element={<DonorProfile />} />
              </Route>
              <Route element={<ProtectedBeneficiaryRoute />}>
                <Route path="/beneficiary/verify" element={<BeneficiaryVerification />} />
                <Route element={<BeneficiaryVerifiedRoute />}>
                  <Route path="/beneficiary/home" element={<BeneficiaryHome />} />
                  <Route path="/beneficiary/qr" element={<BeneficiaryQR />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LocaleProvider>
      </NimaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
