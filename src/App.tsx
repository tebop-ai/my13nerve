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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const location = useLocation();

  React.useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication status...");
      const storedAuth = sessionStorage.getItem("isAdminAuthenticated") === "true";
      console.log("Stored auth:", storedAuth);
      
      if (storedAuth) {
        try {
          // Verify if the user is Super Admin
          const { data: adminProfile, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('email', 'Goapele Main')
            .eq('is_super_admin', true)
            .single();

          if (error) {
            console.error("Error checking admin profile:", error);
            toast({
              title: "Error",
              description: "Failed to verify admin status",
              variant: "destructive",
            });
            setIsAuthenticated(false);
            setIsSuperAdmin(false);
            return;
          }

          if (adminProfile) {
            console.log("Super admin verified:", adminProfile);
            setIsSuperAdmin(true);
          } else {
            console.log("No super admin profile found");
            setIsSuperAdmin(false);
          }
        } catch (error) {
          console.error("Error in checkAuth:", error);
          setIsSuperAdmin(false);
        }
      }
      
      setIsAuthenticated(storedAuth);
    };

    checkAuth();
  }, [location.pathname]); // Re-run when path changes

  if (isAuthenticated === null || (requireSuperAdmin && isSuperAdmin === null)) {
    console.log("Loading authentication state...");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (requireSuperAdmin && !isSuperAdmin)) {
    console.log("Authentication failed, redirecting to home");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("requireSuperAdmin:", requireSuperAdmin);
    console.log("isSuperAdmin:", isSuperAdmin);
    return <Navigate to="/" replace />;
  }

  console.log("Authentication successful, rendering protected content");
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
  const handleAdminLogin = async (username: string, superCode: string): Promise<boolean> => {
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