import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboardOverview = () => {
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
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Your Role</h3>
          <p className="text-3xl font-bold">Admin</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Last Login</h3>
          <p className="text-3xl font-bold">
            {profileData?.last_login 
              ? new Date(profileData.last_login).toLocaleDateString() 
              : 'N/A'}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Status</h3>
          <p className="text-3xl font-bold text-green-600">Active</p>
        </Card>
      </div>
    </Card>
  );
};