import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Building2, Settings } from "lucide-react";
import { DashboardOverview } from "./DashboardSections/DashboardOverview";
import { AdminApplications } from "./DashboardSections/AdminApplications";
import { EnterpriseSettings } from "./DashboardSections/EnterpriseSettings";
import { AdminProfiles } from "./DashboardSections/AdminProfiles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Check if user is super admin
  const { data: adminProfile, isLoading } = useQuery({
    queryKey: ['superAdminCheck'],
    queryFn: async () => {
      console.log("Checking super admin status...");
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', 'goapele.main@superadmin.com')
        .eq('is_super_admin', true)
        .single();

      if (error) {
        console.error("Error checking super admin:", error);
        return null;
      }
      
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !adminProfile) {
      console.log("Not super admin, redirecting...");
      navigate('/admin-dashboard');
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
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, Super Admin
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-muted p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="admin-profiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Profiles
          </TabsTrigger>
          <TabsTrigger value="admin-applications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="admin-profiles">
          <AdminProfiles />
        </TabsContent>

        <TabsContent value="admin-applications">
          <AdminApplications />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Super Admin Settings</h2>
            <p>Global system settings and configurations.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;