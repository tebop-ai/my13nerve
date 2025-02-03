import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationActionsProps {
  application: any;
  onUpdateStatus: (id: string, status: 'approved' | 'declined') => void;
}

export const ApplicationActions = ({ application, onUpdateStatus }: ApplicationActionsProps) => {
  const { toast } = useToast();

  const handleApproval = async () => {
    try {
      console.log("Approving application:", application.id);
      
      // Only update the status - let the database trigger handle user creation
      const { error } = await supabase
        .from('admin_profile_applications')
        .update({ status: 'approved' })
        .eq('id', application.id);

      if (error) {
        console.error('Error updating application:', error);
        throw error;
      }

      onUpdateStatus(application.id, 'approved');
      
      toast({
        title: "Application Approved",
        description: "Admin profile will be created automatically.",
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

  if (application.status !== 'pending') {
    return null;
  }

  return (
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
  );
};