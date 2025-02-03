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
    
    if (!adminEmail || !adminSuperCode) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Logging in...",
      description: "Please wait while we verify your credentials",
    });
    
    try {
      console.log("Starting admin login process...");
      console.log("Attempting login with email:", adminEmail);
      
      // Query for admin profile with exact matches
      const { data: adminProfile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', adminEmail)
        .eq('supercode', adminSuperCode)
        .eq('status', 'active')
        .maybeSingle();

      console.log("Admin profile query result:", { adminProfile, profileError });

      if (profileError) {
        console.error("Database error:", profileError);
        throw new Error('Database error occurred');
      }

      if (!adminProfile) {
        console.log("No matching admin profile found");
        throw new Error('Invalid credentials');
      }

      console.log("Admin profile found:", adminProfile);

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('admin_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminProfile.id);

      if (updateError) {
        console.error("Error updating last login:", updateError);
      }

      // Store authentication state
      sessionStorage.setItem("isAdminAuthenticated", "true");
      sessionStorage.setItem("adminProfile", JSON.stringify(adminProfile));

      toast({
        title: "Login successful",
        description: `Welcome back, ${adminProfile.full_name}!`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
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