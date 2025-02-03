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

  // First, check if user is super admin
  const { data: adminProfile, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      console.log("Checking admin profile...");
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', 'Goapele Main')
        .eq('is_super_admin', true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching admin profile:", error);
        throw error;
      }
      
      console.log("Admin profile:", profile);
      return profile;
    }
  });

  // Then fetch applications if user is super admin
  const { data: applications, isLoading: isLoadingApplications, refetch } = useQuery({
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
    },
    enabled: !!adminProfile
  });

  const verifyAdminProfileCreation = async (applicationId: string): Promise<boolean> => {
    console.log("Verifying admin profile creation for application:", applicationId);
    
    // Wait for a short delay to allow database triggers to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();

    if (error) {
      console.error("Error verifying admin profile:", error);
      return false;
    }

    console.log("Verification result:", profile);
    return !!profile;
  };

  const handleApplicationStatus = async (id: string, status: 'approved' | 'declined') => {
    try {
      console.log(`Updating application ${id} status to ${status}`);
      
      // Update the application status
      const { error: updateError } = await supabase
        .from('admin_profile_applications')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          reviewed_by: adminProfile?.id
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      // If approved, verify the admin profile was created
      if (status === 'approved') {
        const isProfileCreated = await verifyAdminProfileCreation(id);
        
        if (!isProfileCreated) {
          console.error('No admin profile created for application:', id);
          toast({
            title: "Error",
            description: "Failed to create admin profile. Please try again or contact support.",
            variant: "destructive",
          });
          return;
        }

        // Fetch the created profile to get the supercode
        const { data: newProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('supercode')
          .eq('application_id', id)
          .maybeSingle();

        if (profileError || !newProfile) {
          console.error('Error fetching new admin profile:', profileError);
          toast({
            title: "Warning",
            description: "Application approved but there might be an issue with the profile. Please verify.",
            variant: "destructive",
          });
        } else {
          console.log('New admin profile created with supercode:', newProfile.supercode);
          toast({
            title: "Application Approved",
            description: `Admin profile created with supercode: ${newProfile.supercode}`,
          });
        }
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

  if (isCheckingAdmin) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          Checking permissions...
        </div>
      </Card>
    );
  }

  if (!adminProfile) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          You don't have permission to view admin applications
        </div>
      </Card>
    );
  }

  if (isLoadingApplications) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground py-8">
          Loading applications...
        </div>
      </Card>
    );
  }

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