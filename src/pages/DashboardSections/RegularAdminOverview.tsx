import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const RegularAdminOverview = () => {
  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      console.log("Fetching admin profile...");
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

  const { data: enterpriseCount } = useQuery({
    queryKey: ['enterpriseCount'],
    queryFn: async () => {
      console.log("Fetching enterprise count...");
      const { count, error } = await supabase
        .from('enterprise_blueprints')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: userCount } = useQuery({
    queryKey: ['userCount'],
    queryFn: async () => {
      console.log("Fetching user count...");
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('admin_creator_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      return count || 0;
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
              <p className="text-sm text-muted-foreground">Enterprise Users</p>
              <p className="text-2xl font-bold">{userCount}</p>
            </div>
          </div>
        </div>

        {adminProfile?.enterprise_limit && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can create up to {adminProfile.enterprise_limit} enterprises. 
              You have {adminProfile.enterprise_limit - (enterpriseCount || 0)} remaining.
            </AlertDescription>
          </Alert>
        )}
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
            <h3 className="font-medium mb-2">Manage Users</h3>
            <p className="text-sm text-muted-foreground">
              Add or modify enterprise users
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
};