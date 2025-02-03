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
        .update({ status })
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

  const downloadApplication = (application: any) => {
    const applicationData = {
      "Personal Information": {
        "Full Name": application.full_name,
        "Email": application.email,
        "Phone": application.phone_number,
        "Languages": application.languages_spoken,
        "Timezone": application.preferred_timezone
      },
      "Professional Information": {
        "Current Job Title": application.current_job_title,
        "Work Experience": application.work_experience,
        "Industry Expertise": application.industry_expertise,
        "LinkedIn Profile": application.linkedin_profile,
        "Certifications": application.certifications,
        "AI Systems Experience": application.ai_systems_experience
      },
      "Application Details": {
        "Purpose Statement": application.purpose_statement,
        "Personal Statement": application.personal_statement,
        "Role Function": application.role_function,
        "Professional References": application.professional_references,
        "Endorsements": application.endorsements
      },
      "Documents & Verification": {
        "Government ID": application.government_id_url,
        "NDA Document": application.nda_document_url,
        "Background Check Consent": application.background_check_consent ? "Yes" : "No",
        "Terms Accepted": application.terms_accepted ? "Yes" : "No",
        "Code of Conduct Accepted": application.code_of_conduct_accepted ? "Yes" : "No"
      }
    };

    const jsonString = JSON.stringify(applicationData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${application.full_name.replace(/\s+/g, '_')}_application.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            onDownload={downloadApplication}
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