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

const queryClient = new QueryClient();

// Protected Route component with role check
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'super_admin' | 'admin' }) => {
  const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated") === "true";
  const profileData = sessionStorage.getItem("adminProfile");
  const adminProfile = profileData ? JSON.parse(profileData) : null;
  const isSuperAdmin = adminProfile?.is_super_admin === true;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect regular admins trying to access super admin routes
  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    console.log("Regular admin attempting to access super admin route, redirecting...");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Redirect super admin trying to access regular admin routes
  if (requiredRole === 'admin' && isSuperAdmin) {
    console.log("Super admin attempting to access regular admin route, redirecting...");
    return <Navigate to="/dashboard" replace />;
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

  return (
    <div className="min-h-screen flex w-full bg-[#F7F9FC]">
      {!isLandingPage && isAuthenticated && <AppSidebar />}
      <main className={`${!isLandingPage ? 'flex-1 p-8' : 'w-full'}`}>
        <Routes>
          <Route 
            path="/" 
            element={<Index />} 
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