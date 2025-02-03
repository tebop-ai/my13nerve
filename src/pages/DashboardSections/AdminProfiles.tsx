import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { User, Key } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            government_id_url
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
    return <div>Loading profiles...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Profiles</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {profiles?.map((profile) => (
            <Card key={profile.id} className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  {profile.admin_profile_applications?.government_id_url ? (
                    <img 
                      src={profile.admin_profile_applications.government_id_url} 
                      alt={profile.full_name}
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{profile.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last login: {profile.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <Key className="h-4 w-4" />
                    <span className="font-mono">{profile.supercode}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};