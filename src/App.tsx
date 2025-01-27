import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

const queryClient = new QueryClient();

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: "Goapele Main",
  superCode: "DFGSTE^%$2738459K9I8uyhh00"
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Wrapper component to conditionally render sidebar
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAdminAuthenticated") === "true"
  );

  // Function to handle admin login
  const handleAdminLogin = (username: string, superCode: string) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      superCode === ADMIN_CREDENTIALS.superCode
    ) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="min-h-screen flex w-full">
          {!isLandingPage && isAuthenticated && <AppSidebar />}
          <main className={`${!isLandingPage ? 'flex-1' : 'w-full'}`}>
            <Routes>
              <Route 
                path="/" 
                element={<Index onAdminLogin={handleAdminLogin} />} 
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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