import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { User, Key, Clock, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const AdminProfiles = () => {
  const { toast } = useToast();
  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['adminProfiles'],
    queryFn: async () => {
      console.log("Fetching admin profiles...");
      const { data, error } = await supabase
        .from('admin_profiles')
        .select(`
          *,
          admin_profile_applications (
            status,
            government_id_url,
            industry_expertise,
            current_job_title,
            generated_supercode
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error("Error fetching admin profiles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch admin profiles",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Fetched admin profiles:", data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[200px]">
          Loading profiles...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Profiles</h2>
        <Badge variant="secondary">
          {profiles?.length || 0} Active Admins
        </Badge>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {profiles?.map((profile) => (
            <Card key={profile.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  {profile.admin_profile_applications?.government_id_url ? (
                    <img 
                      src={profile.admin_profile_applications.government_id_url} 
                      alt={profile.full_name}
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                        {profile.is_super_admin && (
                          <Shield className="h-4 w-4 text-blue-500" title="Super Admin" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      {profile.admin_profile_applications?.current_job_title && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile.admin_profile_applications.current_job_title}
                        </p>
                      )}
                      {profile.admin_profile_applications?.industry_expertise && (
                        <p className="text-sm text-muted-foreground">
                          {profile.admin_profile_applications.industry_expertise}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {profile.last_login 
                        ? `Last login: ${format(new Date(profile.last_login), 'MMM d, yyyy')}`
                        : 'Never logged in'}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded">
                    <Key className="h-4 w-4 text-gray-500" />
                    <span className="font-mono text-gray-600">{profile.supercode}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Active Admin
                    </Badge>
                    {profile.is_super_admin && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        Super Admin
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {(!profiles || profiles.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No active admin profiles found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};