import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Building2, Settings, Users, User, Briefcase, LayoutDashboard, Boxes } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseManagement } from "./DashboardSections/EnterpriseManagement";
import { UserManagement } from "./DashboardSections/UserManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: adminProfile, isLoading, error } = useQuery({
    queryKey: ['adminCheck'],
    queryFn: async () => {
      console.log("Checking admin status...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        return null;
      }

      if (!user?.email) {
        console.log("No user email found");
        return null;
      }

      console.log("Fetching admin profile for email:", user.email);
      const { data: profile, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', user.email)
        .eq('is_super_admin', false)
        .maybeSingle();

      if (profileError) {
        console.error("Error checking admin status:", profileError);
        return null;
      }
      
      console.log("Admin profile found:", profile);
      return profile;
    },
    retry: false
  });

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        console.error("Query error:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin credentials",
          variant: "destructive"
        });
        navigate('/');
      } else if (!adminProfile) {
        console.log("No regular admin profile found, redirecting...");
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [adminProfile, isLoading, error, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!adminProfile) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="h-10 w-10 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Enterprise Management Portal</h1>
            <p className="text-blue-600">Manage your enterprises and users efficiently</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <User className="h-5 w-5 text-blue-500" />
          <span className="text-blue-700 font-medium">Welcome, {adminProfile.full_name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-blue-900">Enterprise Limit</h3>
              <p className="text-2xl font-bold text-blue-600">{adminProfile.enterprise_limit}</p>
              <p className="text-sm text-blue-700">Maximum enterprises you can manage</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-sky-50 border-sky-200 hover:bg-sky-100 transition-colors">
          <div className="flex items-center gap-3">
            <Boxes className="h-8 w-8 text-sky-500" />
            <div>
              <h3 className="font-semibold text-sky-900">Account Status</h3>
              <p className="text-2xl font-bold text-sky-600 capitalize">
                {adminProfile.validation_status}
              </p>
              <p className="text-sm text-sky-700">Your account validation status</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="enterprises" className="space-y-4">
        <TabsList className="grid grid-cols-2 gap-4 bg-blue-100/50 p-1">
          <TabsTrigger value="enterprises" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
            <Building2 className="h-4 w-4" />
            Enterprises
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
            <Users className="h-4 w-4" />
            Enterprise Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enterprises">
          <EnterpriseManagement adminId={adminProfile.id} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement adminId={adminProfile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;