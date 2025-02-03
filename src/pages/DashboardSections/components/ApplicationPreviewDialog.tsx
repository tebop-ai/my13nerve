import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicationPreviewDialogProps {
  application: any;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationPreviewDialog = ({ 
  application, 
  onOpenChange 
}: ApplicationPreviewDialogProps) => {
  if (!application) return null;

  return (
    <Dialog open={!!application} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Application Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-muted-foreground">{application.full_name}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{application.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{application.phone_number}</p>
                </div>
                <div>
                  <p className="font-medium">Languages</p>
                  <p className="text-muted-foreground">{application.languages_spoken}</p>
                </div>
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-muted-foreground">{application.preferred_timezone}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Current Job Title</p>
                  <p className="text-muted-foreground">{application.current_job_title}</p>
                </div>
                <div>
                  <p className="font-medium">Work Experience</p>
                  <p className="text-muted-foreground">{application.work_experience}</p>
                </div>
                <div>
                  <p className="font-medium">Industry Expertise</p>
                  <p className="text-muted-foreground">{application.industry_expertise}</p>
                </div>
                <div>
                  <p className="font-medium">LinkedIn Profile</p>
                  <p className="text-muted-foreground">{application.linkedin_profile}</p>
                </div>
                <div>
                  <p className="font-medium">Certifications</p>
                  <p className="text-muted-foreground">{application.certifications}</p>
                </div>
                <div>
                  <p className="font-medium">AI Systems Experience</p>
                  <p className="text-muted-foreground">{application.ai_systems_experience}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Application Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Purpose Statement</p>
                  <p className="text-muted-foreground">{application.purpose_statement}</p>
                </div>
                <div>
                  <p className="font-medium">Personal Statement</p>
                  <p className="text-muted-foreground">{application.personal_statement}</p>
                </div>
                <div>
                  <p className="font-medium">Role Function</p>
                  <p className="text-muted-foreground">{application.role_function}</p>
                </div>
                <div>
                  <p className="font-medium">Professional References</p>
                  <p className="text-muted-foreground">{application.professional_references}</p>
                </div>
                <div>
                  <p className="font-medium">Endorsements</p>
                  <p className="text-muted-foreground">{application.endorsements}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Documents & Verification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Government ID</p>
                  <p className="text-muted-foreground">
                    {application.government_id_url ? (
                      <a href={application.government_id_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
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
                    {application.nda_document_url ? (
                      <a href={application.nda_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
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
                    {application.background_check_consent ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Terms Accepted</p>
                  <p className="text-muted-foreground">
                    {application.terms_accepted ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Code of Conduct Accepted</p>
                  <p className="text-muted-foreground">
                    {application.code_of_conduct_accepted ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};