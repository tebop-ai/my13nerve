import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const EnterpriseLoginForm = () => {
  const [email, setEmail] = useState("info@13thai.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Attempting enterprise login for:", email);

    try {
      // Step 1: Sign in with Supabase Auth
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

      console.log("Auth successful, checking user profile");

      // Step 2: Fetch user profile with enterprise_id
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, enterprise_blueprints(*)')
        .eq('email', email)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw new Error("Error fetching user profile");
      }

      if (!userProfile) {
        console.error("No user profile found");
        throw new Error("No enterprise access found. Please contact your administrator.");
      }

      if (!userProfile.enterprise_id) {
        console.error("No enterprise access found");
        throw new Error("No enterprise access found");
      }

      console.log("Enterprise profile found:", userProfile);

      // Step 3: Store authentication data in session storage
      sessionStorage.setItem("isEnterpriseAuthenticated", "true");
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userProfile", JSON.stringify(userProfile));
      sessionStorage.setItem("enterpriseId", userProfile.enterprise_id);

      // Step 4: Show success message and navigate
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate("/enterprise");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
      // Clear session storage on error
      sessionStorage.removeItem("isEnterpriseAuthenticated");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userProfile");
      sessionStorage.removeItem("enterpriseId");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your enterprise account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                <LogIn className="mr-2" /> Sign In
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};