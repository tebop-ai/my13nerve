import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users } from "lucide-react";

export const AdminDashboardOverview = () => {
  const { data: enterpriseCount } = useQuery({
    queryKey: ['enterpriseCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('enterprise_blueprints')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Enterprise Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Enterprises</p>
              <p className="text-2xl font-bold">{enterpriseCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Enterprise Limit</p>
              <p className="text-2xl font-bold">{profileData?.enterprise_limit || 0}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-medium mb-2">Create New Enterprise</h3>
            <p className="text-sm text-muted-foreground">
              Set up a new enterprise blueprint
            </p>
          </Card>
          <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <h3 className="font-medium mb-2">View Enterprise Reports</h3>
            <p className="text-sm text-muted-foreground">
              Access enterprise performance metrics
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
};