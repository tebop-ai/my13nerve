import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Building2, Settings, Users, FileText } from "lucide-react";
import { AdminDashboardOverview } from "./DashboardSections/AdminDashboardOverview";
import { EnterpriseSettings } from "./DashboardSections/EnterpriseSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is a regular admin
  const { data: adminProfile, isLoading } = useQuery({
    queryKey: ['adminCheck'],
    queryFn: async () => {
      console.log("Checking admin status...");
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .eq('is_super_admin', false)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return null;
      }
      
      return profile;
    }
  });

  useEffect(() => {
    if (!isLoading && !adminProfile) {
      console.log("Not a regular admin, redirecting...");
      navigate('/');
    }
  }, [adminProfile, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!adminProfile) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">
            Manage your enterprises and settings
          </p>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Welcome, {adminProfile.full_name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Enterprise Limit</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{adminProfile.enterprise_limit}</p>
          <p className="text-sm text-muted-foreground">Maximum enterprises you can manage</p>
        </Card>
        
        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Validation Status</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 capitalize">
            {adminProfile.validation_status}
          </p>
          <p className="text-sm text-muted-foreground">Your account validation status</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Role Type</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">Regular Admin</p>
          <p className="text-sm text-muted-foreground">Your administrative role</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-4 bg-muted p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="enterprises" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            My Enterprises
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminDashboardOverview />
        </TabsContent>

        <TabsContent value="enterprises">
          <EnterpriseSettings />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{adminProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {adminProfile.last_login 
                        ? new Date(adminProfile.last_login).toLocaleDateString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your SuperCode is securely stored. Contact support if you need to reset it.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;