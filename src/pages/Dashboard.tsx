import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Building2, Settings, Crown, Shield, Siren, Database } from "lucide-react";
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
        <div className="flex items-center gap-3">
          <Crown className="h-10 w-10 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Super Admin Control Center</h1>
            <p className="text-purple-600">Complete system control and oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg border border-purple-200">
          <Shield className="h-5 w-5 text-purple-500" />
          <span className="text-purple-700 font-medium">Super Admin Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-purple-900">Admin Management</h3>
              <p className="text-sm text-purple-700">Oversee admin accounts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 transition-colors">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-indigo-500" />
            <div>
              <h3 className="font-semibold text-indigo-900">System Overview</h3>
              <p className="text-sm text-indigo-700">Monitor performance</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-violet-50 border-violet-200 hover:bg-violet-100 transition-colors">
          <div className="flex items-center gap-3">
            <Siren className="h-8 w-8 text-violet-500" />
            <div>
              <h3 className="font-semibold text-violet-900">Security Center</h3>
              <p className="text-sm text-violet-700">System security status</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-purple-100/50 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="admin-profiles" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
            <Users className="h-4 w-4" />
            Admin Profiles
          </TabsTrigger>
          <TabsTrigger value="admin-applications" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
            <Users className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
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
          <Card className="p-6 border-purple-200">
            <h2 className="text-2xl font-semibold text-purple-900 mb-4">System Configuration</h2>
            <p className="text-purple-700">Global system settings and security configurations.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;