import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCheck, UserX, Eye, Download, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";

interface ApplicationCardProps {
  application: any;
  onPreview: (application: any) => void;
  onDownload: (application: any) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'declined') => void;
}

export const ApplicationCard = ({ 
  application, 
  onPreview, 
  onDownload,
  onUpdateStatus 
}: ApplicationCardProps) => {
  const { toast } = useToast();

  const handleApproval = async () => {
    try {
      console.log("Approving application:", application.id);
      
      const { error: updateError } = await supabase
        .from('admin_profile_applications')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      onUpdateStatus(application.id, 'approved');
      
      toast({
        title: "Application Approved",
        description: "Admin profile has been created successfully.",
      });
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text("Admin Application Form", 20, 20);
      
      // Add application details
      doc.setFontSize(12);
      doc.text(`Full Name: ${application.full_name}`, 20, 40);
      doc.text(`Email: ${application.email}`, 20, 50);
      doc.text(`Phone: ${application.phone_number}`, 20, 60);
      doc.text(`Current Position: ${application.current_job_title}`, 20, 70);
      
      // Add work experience
      doc.text("Work Experience:", 20, 90);
      const workExpLines = doc.splitTextToSize(application.work_experience, 170);
      doc.text(workExpLines, 20, 100);
      
      // Add industry expertise
      doc.text("Industry Expertise:", 20, 130);
      const expertiseLines = doc.splitTextToSize(application.industry_expertise, 170);
      doc.text(expertiseLines, 20, 140);
      
      // Add LinkedIn profile
      doc.text(`LinkedIn: ${application.linkedin_profile}`, 20, 170);
      
      // Add status and timestamps
      doc.text(`Status: ${application.status}`, 20, 190);
      doc.text(`Submitted: ${format(new Date(application.created_at), 'MMM d, yyyy')}`, 20, 200);
      
      // Download the PDF
      doc.save(`${application.full_name.replace(/\s+/g, '_')}_application.pdf`);
      
      toast({
        title: "Download Complete",
        description: "Application PDF has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate application PDF.",
        variant: "destructive",
      });
    }
  };

  return (
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
            onClick={() => onPreview(application)}
            variant="outline"
            size="sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {application.status === 'pending' && (
            <>
              <Button
                onClick={handleApproval}
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => onUpdateStatus(application.id, 'declined')}
                variant="destructive"
                size="sm"
              >
                <UserX className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </>
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
      {application.status === 'approved' && application.generated_supercode && (
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <p className="text-sm font-medium text-gray-600">SuperCode:</p>
          <p className="font-mono text-sm">{application.generated_supercode}</p>
        </div>
      )}
    </Card>
  );
};