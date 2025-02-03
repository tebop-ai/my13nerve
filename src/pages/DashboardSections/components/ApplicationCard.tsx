import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Download, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { ApplicationActions } from "./ApplicationActions";

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

  const handleDownload = async () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text("Admin Application Form", 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Full Name: ${application.full_name}`, 20, 40);
      doc.text(`Email: ${application.email}`, 20, 50);
      doc.text(`Phone: ${application.phone_number || 'Not provided'}`, 20, 60);
      doc.text(`Current Position: ${application.current_job_title}`, 20, 70);
      
      doc.text("Work Experience:", 20, 90);
      const workExpLines = doc.splitTextToSize(application.work_experience || 'Not provided', 170);
      doc.text(workExpLines, 20, 100);
      
      doc.text("Industry Expertise:", 20, 130);
      const expertiseLines = doc.splitTextToSize(application.industry_expertise || 'Not provided', 170);
      doc.text(expertiseLines, 20, 140);
      
      doc.text(`LinkedIn: ${application.linkedin_profile || 'Not provided'}`, 20, 170);
      
      doc.text(`Status: ${application.status}`, 20, 190);
      doc.text(`Submitted: ${format(new Date(application.created_at), 'MMM d, yyyy')}`, 20, 200);
      
      if (application.status === 'approved' && application.generated_supercode) {
        doc.text(`SuperCode: ${application.generated_supercode}`, 20, 210);
      }
      
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
    <Card className="p-4 space-y-4">
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
          <ApplicationActions 
            application={application}
            onUpdateStatus={onUpdateStatus}
          />
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