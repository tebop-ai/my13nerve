import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCheck, UserX, Eye, Download, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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
      
      if (status === 'approved') {
        // First update the application status which will trigger the supercode generation
        const { error: updateError } = await supabase
          .from('admin_profile_applications')
          .update({ status })
          .eq('id', id);

        if (updateError) throw updateError;

        // Fetch the updated application to get the generated supercode
        const { data: updatedApp, error: fetchError } = await supabase
          .from('admin_profile_applications')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        toast({
          title: "Application Approved",
          description: `Admin profile created successfully. Supercode: ${updatedApp.generated_supercode}`,
        });
      } else {
        const { error } = await supabase
          .from('admin_profile_applications')
          .update({ status })
          .eq('id', id);

        if (error) throw error;

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
          <Card key={application.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{application.full_name}</h3>
                  {application.status === 'approved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  )}
                  {application.status === 'declined' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Declined
                    </span>
                  )}
                  {application.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{application.email}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(application.created_at), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => setPreviewApplication(application)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={() => downloadApplication(application)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {application.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleApplicationStatus(application.id, 'approved')}
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
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
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-600">SuperCode:</p>
                    <p className="font-mono text-sm">{application.generated_supercode}</p>
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

      <Dialog open={!!previewApplication} onOpenChange={() => setPreviewApplication(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            {previewApplication && (
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-muted-foreground">{previewApplication.full_name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{previewApplication.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{previewApplication.phone_number}</p>
                    </div>
                    <div>
                      <p className="font-medium">Languages</p>
                      <p className="text-muted-foreground">{previewApplication.languages_spoken}</p>
                    </div>
                    <div>
                      <p className="font-medium">Timezone</p>
                      <p className="text-muted-foreground">{previewApplication.preferred_timezone}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Current Job Title</p>
                      <p className="text-muted-foreground">{previewApplication.current_job_title}</p>
                    </div>
                    <div>
                      <p className="font-medium">Work Experience</p>
                      <p className="text-muted-foreground">{previewApplication.work_experience}</p>
                    </div>
                    <div>
                      <p className="font-medium">Industry Expertise</p>
                      <p className="text-muted-foreground">{previewApplication.industry_expertise}</p>
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn Profile</p>
                      <p className="text-muted-foreground">{previewApplication.linkedin_profile}</p>
                    </div>
                    <div>
                      <p className="font-medium">Certifications</p>
                      <p className="text-muted-foreground">{previewApplication.certifications}</p>
                    </div>
                    <div>
                      <p className="font-medium">AI Systems Experience</p>
                      <p className="text-muted-foreground">{previewApplication.ai_systems_experience}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Purpose Statement</p>
                      <p className="text-muted-foreground">{previewApplication.purpose_statement}</p>
                    </div>
                    <div>
                      <p className="font-medium">Personal Statement</p>
                      <p className="text-muted-foreground">{previewApplication.personal_statement}</p>
                    </div>
                    <div>
                      <p className="font-medium">Role Function</p>
                      <p className="text-muted-foreground">{previewApplication.role_function}</p>
                    </div>
                    <div>
                      <p className="font-medium">Professional References</p>
                      <p className="text-muted-foreground">{previewApplication.professional_references}</p>
                    </div>
                    <div>
                      <p className="font-medium">Endorsements</p>
                      <p className="text-muted-foreground">{previewApplication.endorsements}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Documents & Verification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Government ID</p>
                      <p className="text-muted-foreground">
                        {previewApplication.government_id_url ? (
                          <a href={previewApplication.government_id_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Document
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">NDA Document</p>
                      <p className="text-muted-foreground">
                        {previewApplication.nda_document_url ? (
                          <a href={previewApplication.nda_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Document
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Background Check Consent</p>
                      <p className="text-muted-foreground">
                        {previewApplication.background_check_consent ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Terms Accepted</p>
                      <p className="text-muted-foreground">
                        {previewApplication.terms_accepted ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Code of Conduct Accepted</p>
                      <p className="text-muted-foreground">
                        {previewApplication.code_of_conduct_accepted ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};