import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from "lucide-react";
import { RegularAdminOverview } from "./DashboardSections/RegularAdminOverview";
import { EnterpriseManagement } from "./DashboardSections/EnterpriseManagement";
import { UserManagement } from "./DashboardSections/UserManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-10 w-10 text-gray-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Management</h1>
          <p className="text-gray-600">Manage your assigned enterprises and users</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 gap-4 bg-gray-100/50 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="enterprises" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            My Enterprises
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Enterprise Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RegularAdminOverview />
        </TabsContent>

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