import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, Lock, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLoginForm = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminSuperCode, setAdminSuperCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting login attempt with email:", adminEmail);

    try {
      // First, check if the admin profile exists and is active
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', adminEmail)
        .maybeSingle();

      console.log("Admin profile query result:", adminProfile);

      if (profileError) {
        console.error("Profile query error:", profileError);
        throw new Error('Error checking admin profile');
      }

      if (!adminProfile) {
        console.log("No admin profile found");
        throw new Error('Invalid credentials');
      }

      if (adminProfile.status !== 'active') {
        console.log("Admin profile not active");
        throw new Error('Admin account is not active');
      }

      // Compare supercodes exactly
      if (adminProfile.supercode !== adminSuperCode) {
        console.log("Supercode mismatch");
        throw new Error('Invalid credentials');
      }

      // Sign in with Supabase Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminSuperCode // Using supercode as password
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        // If the user doesn't exist in auth, create them
        if (signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminSuperCode,
          });
          if (signUpError) throw signUpError;
        } else {
          throw signInError;
        }
      }

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminProfile.id);

      if (updateError) {
        console.error("Error updating last login:", updateError);
      }

      // Store authentication state and profile
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
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
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