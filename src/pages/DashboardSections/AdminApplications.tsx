import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ApplicationCard } from "./components/ApplicationCard";
import { ApplicationPreviewDialog } from "./components/ApplicationPreviewDialog";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { jsPDF as jsPDFType } from 'jspdf';

// Extend jsPDF type to include lastAutoTable property
interface ExtendedJsPDF extends jsPDFType {
  lastAutoTable: {
    finalY: number;
  };
}

export const AdminApplications = () => {
  const { toast } = useToast();
  const [previewApplication, setPreviewApplication] = useState<any>(null);
  const queryClient = useQueryClient();

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
        // Refresh both applications and profiles lists
        queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
        queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
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

  const downloadApplicationPDF = async (application: any) => {
    try {
      const doc = new jsPDF() as ExtendedJsPDF;
      
      // Add title
      doc.setFontSize(20);
      doc.text('Admin Application', 14, 20);
      
      // Personal Information
      doc.setFontSize(16);
      doc.text('Personal Information', 14, 40);
      autoTable(doc, {
        startY: 45,
        head: [['Field', 'Value']],
        body: [
          ['Full Name', application.full_name],
          ['Email', application.email],
          ['Phone', application.phone_number || 'N/A'],
          ['Languages', application.languages_spoken || 'N/A'],
          ['Timezone', application.preferred_timezone || 'N/A']
        ],
      });

      // Professional Information
      doc.text('Professional Information', 14, doc.lastAutoTable.finalY + 20);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Field', 'Value']],
        body: [
          ['Current Position', application.current_job_title || 'N/A'],
          ['Industry Expertise', application.industry_expertise || 'N/A'],
          ['Work Experience', application.work_experience || 'N/A'],
          ['Certifications', application.certifications || 'N/A'],
          ['AI Systems Experience', application.ai_systems_experience || 'N/A']
        ],
      });

      // Application Details
      doc.text('Application Details', 14, doc.lastAutoTable.finalY + 20);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Field', 'Value']],
        body: [
          ['Purpose Statement', application.purpose_statement || 'N/A'],
          ['Personal Statement', application.personal_statement || 'N/A'],
          ['Role Function', application.role_function || 'N/A'],
          ['Professional References', application.professional_references || 'N/A']
        ],
      });

      // Save PDF
      const pdfName = `${application.full_name.replace(/\s+/g, '_')}_application.pdf`;
      doc.save(pdfName);

      // Update the pdf_downloaded_at timestamp
      const { error } = await supabase
        .from('admin_profile_applications')
        .update({ pdf_downloaded_at: new Date().toISOString() })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "PDF Downloaded",
        description: "Application has been saved as PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
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
            onDownload={downloadApplicationPDF}
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