import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Wrapper component to conditionally render sidebar
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="min-h-screen flex w-full">
          {!isLandingPage && <AppSidebar />}
          <main className={`${!isLandingPage ? 'flex-1' : 'w-full'}`}>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </SidebarProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;