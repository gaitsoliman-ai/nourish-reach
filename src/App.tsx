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
import BeneficiaryHome from "./pages/BeneficiaryHome.tsx";
import BeneficiaryQR from "./pages/BeneficiaryQR.tsx";
import { NimaProvider } from "./context/NimaContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <NimaProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donor/onboarding" element={<DonorOnboarding />} />
            <Route path="/donor/login" element={<DonorLogin />} />
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/create" element={<DonorCreate />} />
            <Route path="/donor/verify" element={<DonorVerify />} />
            <Route path="/beneficiary/home" element={<BeneficiaryHome />} />
            <Route path="/beneficiary/qr" element={<BeneficiaryQR />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NimaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
