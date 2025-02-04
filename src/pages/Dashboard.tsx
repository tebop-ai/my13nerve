import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Building2, Settings, Crown, Shield, Siren, Database, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DashboardOverview } from "./DashboardSections/DashboardOverview";
import { AdminApplications } from "./DashboardSections/AdminApplications";
import { EnterpriseSettings } from "./DashboardSections/EnterpriseSettings";
import { AdminProfiles } from "./DashboardSections/AdminProfiles";
import { CreateAiAgentDialog } from "@/components/ai/CreateAiAgentDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      toast({
        title: "Access Denied",
        description: "Only Super Admin can access this dashboard",
        variant: "destructive"
      });
      navigate('/admin-dashboard');
    }
  }, [adminProfile, isLoading, navigate, toast]);

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
          <Crown className="h-10 w-10 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Control Center</h1>
            <p className="text-gray-600">Complete system control and oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CreateAiAgentDialog />
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
            <Sparkles className="h-5 w-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Super Admin Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-gray-700" />
            <div>
              <h3 className="font-semibold text-gray-900">System Security</h3>
              <p className="text-sm text-gray-600">Monitor system access</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-gray-700" />
            <div>
              <h3 className="font-semibold text-gray-900">System Overview</h3>
              <p className="text-sm text-gray-600">Monitor performance</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <Siren className="h-8 w-8 text-gray-700" />
            <div>
              <h3 className="font-semibold text-gray-900">Security Center</h3>
              <p className="text-sm text-gray-600">System security status</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-gray-100/50 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            System Overview
          </TabsTrigger>
          <TabsTrigger value="admin-profiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Management
          </TabsTrigger>
          <TabsTrigger value="admin-applications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
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
          <EnterpriseSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;