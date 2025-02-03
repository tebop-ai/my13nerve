import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseCard } from "@/components/enterprise/EnterpriseCard";
import { CreateEnterpriseDialog } from "@/components/enterprise/CreateEnterpriseDialog";

interface EnterpriseManagementProps {
  adminId: string;
}

export const EnterpriseManagement = ({ adminId }: EnterpriseManagementProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch available blueprints
  const { data: blueprints } = useQuery({
    queryKey: ['blueprints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch enterprises created by this admin
  const { data: enterprises, refetch: refetchEnterprises } = useQuery({
    queryKey: ['enterprises', adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('created_by', adminId);
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateEnterprise = async (name: string, blueprintId: string) => {
    if (!blueprintId || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const blueprint = blueprints?.find(b => b.id === blueprintId);
    if (!blueprint) return;

    try {
      const { error } = await supabase
        .from('enterprise_blueprints')
        .insert({
          name,
          enterprise_type: blueprint.enterprise_type,
          board_type: blueprint.board_type,
          ceo_type: blueprint.ceo_type,
          executive_types: blueprint.executive_types,
          management_types: blueprint.management_types,
          department_types: blueprint.department_types,
          created_by: adminId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Enterprise created successfully",
      });

      setIsCreating(false);
      refetchEnterprises();

    } catch (error) {
      console.error("Error creating enterprise:", error);
      toast({
        title: "Error",
        description: "Failed to create enterprise",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEnterprise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('enterprise_blueprints')
        .delete()
        .eq('id', id)
        .eq('created_by', adminId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Enterprise deleted successfully",
      });

      refetchEnterprises();

    } catch (error) {
      console.error("Error deleting enterprise:", error);
      toast({
        title: "Error",
        description: "Failed to delete enterprise",
        variant: "destructive",
      });
    }
  };

  const handleEditEnterprise = (id: string) => {
    // To be implemented in future
    console.log("Edit enterprise:", id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Enterprises</h2>
        <CreateEnterpriseDialog
          blueprints={blueprints || []}
          isOpen={isCreating}
          onOpenChange={setIsCreating}
          onCreate={handleCreateEnterprise}
        />
      </div>

      <div className="grid gap-4">
        {enterprises?.map((enterprise) => (
          <EnterpriseCard
            key={enterprise.id}
            enterprise={enterprise}
            onDelete={handleDeleteEnterprise}
            onEdit={handleEditEnterprise}
          />
        ))}
        
        {!enterprises?.length && (
          <Card className="p-6 text-center text-muted-foreground">
            No enterprises created yet. Click the button above to create your first enterprise.
          </Card>
        )}
      </div>
    </div>
  );
};
