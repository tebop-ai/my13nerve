import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EnterpriseLoginForm } from "@/components/auth/EnterpriseLoginForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

interface IndexProps {
  onAdminLogin: (username: string, superCode: string) => Promise<boolean>;
}

const Index = ({ onAdminLogin }: IndexProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (username: string, superCode: string) => {
    setIsLoading(true);
    console.log("Attempting admin login with:", { username });
    
    try {
      const isSuperAdmin = username === 'Goapele Main';
      console.log("Is Super Admin check:", isSuperAdmin);

      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', username)
        .eq('status', 'active')
        .eq('is_super_admin', isSuperAdmin)
        .maybeSingle();

      console.log("Admin profile query result:", { adminProfile, adminError });

      if (adminError) {
        console.error("Error verifying admin profile:", adminError);
        throw new Error("Failed to verify admin credentials");
      }

      if (!adminProfile) {
        console.log("No matching admin profile found");
        throw new Error("Invalid credentials");
      }

      if (adminProfile.supercode !== superCode) {
        console.log("Supercode mismatch");
        throw new Error("Invalid credentials");
      }

      console.log("Admin profile verified:", adminProfile);

      const loginSuccess = await onAdminLogin(username, superCode);
      if (!loginSuccess) {
        console.error("Login failed in onAdminLogin");
        throw new Error("Login failed");
      }

      toast({
        title: "Login successful",
        description: isSuperAdmin ? "Welcome back, Super Admin!" : "Welcome back, Admin!",
      });

      navigate(isSuperAdmin ? "/dashboard" : "/admin-dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      localStorage.removeItem("isAdminAuthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">my13nerve</h1>
          <p className="text-gray-600">Business Co-pilot Platform</p>
        </div>

        <Tabs defaultValue="admins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="users">Enterprise Users</TabsTrigger>
            <TabsTrigger value="admins">For Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6">
              <EnterpriseLoginForm 
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="p-6">
              <AdminLoginForm 
                onAdminLogin={handleAdminSubmit}
                isLoading={isLoading}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;