import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCheck, UserX } from "lucide-react";

export const AdminApplications = () => {
  const { toast } = useToast();

  const { data: applications, refetch } = useQuery({
    queryKey: ['adminApplications'],
    queryFn: async () => {
      console.log("Fetching admin applications...");
      const { data, error } = await supabase
        .from('admin_profile_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }
      
      console.log("Fetched applications:", data);
      return data;
    }
  });

  const handleApplicationStatus = async (id: string, status: 'approved' | 'declined') => {
    try {
      console.log(`Updating application ${id} status to ${status}`);
      const { error } = await supabase
        .from('admin_profile_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Application ${status}`,
        description: `The admin application has been ${status}.`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Applications</h2>
      <div className="space-y-6">
        {applications?.map((application) => (
          <Card key={application.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{application.full_name}</h3>
                <p className="text-sm text-muted-foreground">{application.email}</p>
              </div>
              <div className="space-x-2">
                {application.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApplicationStatus(application.id, 'approved')}
                      variant="default"
                      size="sm"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleApplicationStatus(application.id, 'declined')}
                      variant="destructive"
                      size="sm"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </>
                )}
                {application.status === 'approved' && (
                  <div className="text-green-600 font-medium">
                    Approved | SuperCode: {application.generated_supercode}
                  </div>
                )}
                {application.status === 'declined' && (
                  <div className="text-red-600 font-medium">
                    Declined
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Current Position</p>
                <p>{application.current_job_title}</p>
              </div>
              <div>
                <p className="font-medium">Industry Expertise</p>
                <p>{application.industry_expertise}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-medium">Purpose Statement</p>
              <p className="mt-1">{application.purpose_statement}</p>
            </div>
          </Card>
        ))}
        {applications?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No pending admin applications
          </div>
        )}
      </div>
    </Card>
  );
};