import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { EnterpriseLoginForm } from "@/components/login/EnterpriseLoginForm";
import { AdminLoginForm } from "@/components/login/AdminLoginForm";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSignup from "./pages/AdminSignup";
import EnterpriseView from "./pages/EnterpriseView";

const queryClient = new QueryClient();

// Protected Route component with role check
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'super_admin' | 'admin' | 'enterprise' }) => {
  const isAdminAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
  const isEnterpriseAuthenticated = sessionStorage.getItem("isEnterpriseAuthenticated") === "true";
  const profileData = sessionStorage.getItem("adminProfile");
  const adminProfile = profileData ? JSON.parse(profileData) : null;
  const isSuperAdmin = adminProfile?.is_super_admin === true;
  
  console.log("Protected Route Check:", {
    isAdminAuthenticated,
    isEnterpriseAuthenticated,
    isSuperAdmin,
    requiredRole
  });

  if (requiredRole === 'enterprise' && !isEnterpriseAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if ((requiredRole === 'admin' || requiredRole === 'super_admin') && !isAdminAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (requiredRole === 'admin' && isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Landing page component to handle role-based login
const LandingPage = () => {
  const [loginType, setLoginType] = React.useState<'enterprise' | 'admin'>('enterprise');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/ed890ce8-93b5-46f2-a9f4-f00fe6437b34.png"
            alt="my13nerve"
            className="h-20 mx-auto mb-6" // Changed from h-24 to h-20 (1.25x from h-16)
          />
          <div className="mt-4 space-x-4">
            <button
              onClick={() => setLoginType('enterprise')}
              className={`px-4 py-2 rounded ${loginType === 'enterprise' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Enterprise User Login
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`px-4 py-2 rounded ${loginType === 'admin' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              Admin Login
            </button>
          </div>
        </div>
        
        {loginType === 'enterprise' ? (
          <EnterpriseLoginForm />
        ) : (
          <AdminLoginForm />
        )}
      </div>
    </div>
  );
};

// Wrapper component to conditionally render sidebar
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    sessionStorage.getItem("isAdminAuthenticated") === "true" || 
    sessionStorage.getItem("isEnterpriseAuthenticated") === "true"
  );

  React.useEffect(() => {
    const checkAuth = () => {
      const auth = sessionStorage.getItem("isAdminAuthenticated") === "true" || 
                  sessionStorage.getItem("isEnterpriseAuthenticated") === "true";
      setIsAuthenticated(auth);
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-[#F7F9FC]">
      {!isLandingPage && isAuthenticated && <AppSidebar />}
      <main className={`${!isLandingPage ? 'flex-1 p-8' : 'w-full'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/enterprise/*"
            element={
              <ProtectedRoute requiredRole="enterprise">
                <EnterpriseView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-signup" element={<AdminSignup />} />
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