import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { User, Key, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const AdminProfiles = () => {
  const { data: profiles, isLoading } = useQuery({
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
            current_job_title
          )
        `);

      if (error) {
        console.error("Error fetching admin profiles:", error);
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
      <h2 className="text-2xl font-semibold mb-4">Admin Profiles</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {profiles?.map((profile) => (
            <Card key={profile.id} className="p-4">
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
                      <h3 className="text-lg font-semibold">{profile.full_name}</h3>
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
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Admin
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {(!profiles || profiles.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No admin profiles found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};