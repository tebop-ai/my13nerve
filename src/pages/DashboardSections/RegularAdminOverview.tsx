import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Building2, Users } from "lucide-react";

export const RegularAdminOverview = () => {
  console.log("Rendering Regular Admin Overview");

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

  const { data: userCount = 0 } = useQuery({
    queryKey: ['userCount', adminProfile?.id],
    enabled: !!adminProfile?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('admin_creator_id', adminProfile?.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const enterpriseLimit = adminProfile?.enterprise_limit || 5;
  const enterpriseUsagePercentage = (enterpriseCount / enterpriseLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">My Enterprises</h3>
              <p className="text-3xl font-bold">{enterpriseCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Enterprise Usage</span>
              <span>{enterpriseCount} of {enterpriseLimit}</span>
            </div>
            <Progress value={enterpriseUsagePercentage} className="h-2" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Enterprise Users</h3>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Total users across all enterprises
          </p>
        </Card>
      </div>

      {enterpriseUsagePercentage >= 80 && (
        <Alert>
          <AlertDescription>
            You are approaching your enterprise limit. Contact support if you need to increase your limit.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};