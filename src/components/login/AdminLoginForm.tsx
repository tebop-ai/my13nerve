import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, Lock, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting admin login attempt with email:", email);

    try {
      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Invalid credentials");
      }

      if (!authData.user) {
        throw new Error("No user data returned");
      }

      console.log("Auth successful, checking admin profile");

      // Then verify admin profile
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .eq('validation_status', 'validated')
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Error fetching admin profile");
      }

      if (!adminProfile) {
        console.error("No admin profile found");
        throw new Error("No admin access found. Please contact the super admin.");
      }

      console.log("Admin profile found:", adminProfile);

      sessionStorage.setItem("isAdminAuthenticated", "true");
      sessionStorage.setItem("adminProfile", JSON.stringify(adminProfile));

      toast({
        title: "Login successful",
        description: `Welcome back, ${adminProfile.full_name}!`,
      });

      // Redirect based on admin type
      if (adminProfile.is_super_admin) {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
      sessionStorage.removeItem("isAdminAuthenticated");
      sessionStorage.removeItem("adminProfile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <>
                <span className="animate-spin mr-2">⌛</span>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2" /> 
                Access Admin Panel
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
  );
};