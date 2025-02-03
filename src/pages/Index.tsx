import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Lock, LogIn, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IndexProps {
  onAdminLogin: (username: string, superCode: string) => boolean;
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
    
    try {
      console.log("Attempting admin login...");
      
      // First check if this is a valid admin in our profiles
      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', adminUsername)
        .eq('supercode', adminSuperCode)
        .eq('status', 'active')
        .maybeSingle();

      if (adminError) {
        console.error("Admin login error:", adminError);
        throw new Error('Database error occurred');
      }

      if (!adminProfile) {
        console.log("No admin profile found");
        throw new Error('Invalid credentials');
      }

      // If valid, proceed with the app's login flow
      if (onAdminLogin(adminUsername, adminSuperCode)) {
        console.log("Admin login successful");
        toast({
          title: "Login successful",
          description: `Welcome back, ${adminProfile.full_name}!`,
        });

        // Update last login timestamp
        const { error: updateError } = await supabase
          .from('admin_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminProfile.id);

        if (updateError) {
          console.error("Error updating last login:", updateError);
        }

        navigate("/dashboard");
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
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

        <Tabs defaultValue="users" className="w-full">
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
                    <label className="text-sm font-medium">Username</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        className="pl-10"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        disabled={isLoading}
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
                    <LogIn className="mr-2" /> 
                    {isLoading ? "Signing in..." : "Access Admin Panel"}
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