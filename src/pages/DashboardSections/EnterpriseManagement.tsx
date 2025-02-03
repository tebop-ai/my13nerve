import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { EnterpriseType, BoardType, CEOType } from "@/types/enterprise";

interface EnterpriseManagementProps {
  adminId: string;
}

export const EnterpriseManagement = ({ adminId }: EnterpriseManagementProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>("");
  const [enterpriseName, setEnterpriseName] = useState("");

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

  const handleCreateEnterprise = async () => {
    if (!selectedBlueprint || !enterpriseName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const blueprint = blueprints?.find(b => b.id === selectedBlueprint);
    if (!blueprint) return;

    try {
      const { error } = await supabase
        .from('enterprise_blueprints')
        .insert({
          name: enterpriseName,
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
      setEnterpriseName("");
      setSelectedBlueprint("");
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Enterprises</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Enterprise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Enterprise</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Enterprise Name</Label>
                <Input
                  value={enterpriseName}
                  onChange={(e) => setEnterpriseName(e.target.value)}
                  placeholder="Enter enterprise name"
                />
              </div>
              <div>
                <Label>Select Blueprint</Label>
                <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blueprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {blueprints?.map((blueprint) => (
                      <SelectItem key={blueprint.id} value={blueprint.id}>
                        {blueprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateEnterprise} className="w-full">
                Create Enterprise
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {enterprises?.map((enterprise) => (
          <Card key={enterprise.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{enterprise.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {enterprise.enterprise_type.replace('_', ' ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleDeleteEnterprise(enterprise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
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