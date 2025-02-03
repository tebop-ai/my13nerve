import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, LogIn, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IndexProps {
  onAdminLogin: (username: string, superCode: string) => Promise<boolean>;
}

const Index = ({ onAdminLogin }: IndexProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminSuperCode, setAdminSuperCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Attempting admin login with:", { adminUsername });
    
    try {
      // First verify if this is the Super Admin
      const isSuperAdmin = adminUsername === 'goapele.main@my13nerve.com';
      console.log("Is Super Admin check:", isSuperAdmin);

      // Query admin profile - modified to correctly check for super admin
      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', adminUsername)
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

      // Verify supercode
      if (adminProfile.supercode !== adminSuperCode) {
        console.log("Supercode mismatch");
        throw new Error("Invalid credentials");
      }

      console.log("Admin profile verified:", adminProfile);

      // Set authentication state
      const loginSuccess = await onAdminLogin(adminUsername, adminSuperCode);
      if (!loginSuccess) {
        console.error("Login failed in onAdminLogin");
        throw new Error("Login failed");
      }

      toast({
        title: "Login successful",
        description: isSuperAdmin ? "Welcome back, Super Admin!" : "Welcome back, Admin!",
      });

      // Navigate based on admin type
      navigate(isSuperAdmin ? "/dashboard" : "/admin-dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      // Clear authentication state on error
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
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {isLogin ? "Welcome Back" : "Get Started"}
                  </h2>
                  <p className="text-gray-500">
                    {isLogin
                      ? "Sign in to your account"
                      : "Create your enterprise account"}
                  </p>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enterprise Code</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your enterprise code"
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  {isLogin ? (
                    <>
                      <LogIn className="mr-2" /> Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2" /> Sign Up
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline text-sm"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold">Admin Access</h2>
                  <p className="text-gray-500">Sign in with your admin credentials</p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">SuperCode</label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Enter your SuperCode"
                        className="pl-10"
                        value={adminSuperCode}
                        onChange={(e) => setAdminSuperCode(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Logging in..."
                    ) : (
                      <>
                        <LogIn className="mr-2" /> Access Admin Panel
                      </>
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-gray-600 mb-4">Want to become an admin?</p>
                    <Button 
                      onClick={() => navigate("/admin-signup")} 
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <UserPlus className="mr-2" /> Apply for Admin Role
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;