import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ApplicationCard } from "./components/ApplicationCard";
import { ApplicationPreviewDialog } from "./components/ApplicationPreviewDialog";

export const AdminApplications = () => {
  const { toast } = useToast();
  const [previewApplication, setPreviewApplication] = useState<any>(null);

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
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      if (status === 'approved') {
        toast({
          title: "Application Approved",
          description: "Admin profile will be created automatically.",
        });
      } else {
        toast({
          title: "Application Declined",
          description: "The admin application has been declined.",
        });
      }

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
          <ApplicationCard
            key={application.id}
            application={application}
            onPreview={setPreviewApplication}
            onDownload={() => {}}
            onUpdateStatus={handleApplicationStatus}
          />
        ))}
        {(!applications || applications.length === 0) && (
          <div className="text-center text-muted-foreground py-8">
            No pending admin applications
          </div>
        )}
      </div>

      <ApplicationPreviewDialog
        application={previewApplication}
        onOpenChange={() => setPreviewApplication(null)}
      />
    </Card>
  );
};