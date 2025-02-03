import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSignup from "./pages/AdminSignup";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Admin credentials for Super Admin
const SUPER_ADMIN_CREDENTIALS = {
  username: "Goapele Main",
  superCode: "DFGSTE^%$2738459K9I8uyhh00"
};

// Protected Route component with Super Admin check
const ProtectedRoute = ({ children, requireSuperAdmin = false }: { children: React.ReactNode, requireSuperAdmin?: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = sessionStorage.getItem("isAdminAuthenticated") === "true";
      
      if (storedAuth) {
        // Verify if the user is Super Admin
        const { data: adminProfile, error } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('email', 'Goapele Main')
          .single();

        if (!error && adminProfile) {
          setIsSuperAdmin(true);
        }
      }
      
      setIsAuthenticated(storedAuth);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null || (requireSuperAdmin && isSuperAdmin === null)) {
    // Show loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (requireSuperAdmin && !isSuperAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Wrapper component to conditionally render sidebar
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    sessionStorage.getItem("isAdminAuthenticated") === "true"
  );

  // Function to handle admin login
  const handleAdminLogin = async (username: string, superCode: string) => {
    console.log("Attempting admin login:", { username });
    
    if (
      username === SUPER_ADMIN_CREDENTIALS.username &&
      superCode === SUPER_ADMIN_CREDENTIALS.superCode
    ) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex w-full bg-[#F7F9FC]">
      {!isLandingPage && isAuthenticated && <AppSidebar />}
      <main className={`${!isLandingPage ? 'flex-1 p-8' : 'w-full'}`}>
        <Routes>
          <Route 
            path="/" 
            element={<Index onAdminLogin={handleAdminLogin} />} 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireSuperAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-signup"
            element={<AdminSignup />}
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  console.log("Rendering App component");

  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <TooltipProvider>
              <AppContent />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;