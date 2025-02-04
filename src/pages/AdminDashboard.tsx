import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import { RegularAdminOverview } from "./DashboardSections/RegularAdminOverview";
import { EnterpriseManagement } from "./DashboardSections/EnterpriseManagement";
import { UserManagement } from "./DashboardSections/UserManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  console.log("Rendering Regular Admin Dashboard");
  
  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return null;

      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (error) {
        console.error("Error fetching admin profile:", error);
        throw error;
      }
      return data;
    }
  });

  // Fetch enterprise count
  const { data: enterpriseCount = 0 } = useQuery({
    queryKey: ['enterpriseCount', adminProfile?.id],
    enabled: !!adminProfile?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('enterprise_blueprints')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', adminProfile?.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Calculate enterprise usage percentage
  const enterpriseLimit = adminProfile?.enterprise_limit || 5;
  const enterpriseUsagePercentage = (enterpriseCount / enterpriseLimit) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-10 w-10 text-gray-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Management</h1>
          <p className="text-gray-600">Manage your assigned enterprises and users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enterprise Usage</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Enterprises Created</span>
              <span>{enterpriseCount} of {enterpriseLimit}</span>
            </div>
            <Progress value={enterpriseUsagePercentage} className="h-2" />
          </div>
        </Card>
      </div>

      {enterpriseUsagePercentage >= 80 && (
        <Alert className="mb-6">
          <AlertDescription>
            You are approaching your enterprise limit. Contact support if you need to increase your limit.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="enterprises" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 gap-4 bg-gray-100/50 p-1">
          <TabsTrigger value="enterprises" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            My Enterprises
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Enterprise Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enterprises">
          <EnterpriseManagement adminId={adminProfile?.id || ''} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement adminId={adminProfile?.id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;