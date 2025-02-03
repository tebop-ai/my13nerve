import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateEnterpriseDialogProps {
  blueprints: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, blueprintId: string) => void;
}

export const CreateEnterpriseDialog = ({ 
  blueprints, 
  isOpen, 
  onOpenChange, 
  onCreate 
}: CreateEnterpriseDialogProps) => {
  const [enterpriseName, setEnterpriseName] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState("");

  const handleCreate = () => {
    onCreate(enterpriseName, selectedBlueprint);
    setEnterpriseName("");
    setSelectedBlueprint("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={handleCreate} className="w-full">
            Create Enterprise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};