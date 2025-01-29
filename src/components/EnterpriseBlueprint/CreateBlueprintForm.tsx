import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const ENTERPRISE_TYPES = ['startup', 'small_business', 'medium_business', 'corporation', 'non_profit', 'government'];
const BOARD_TYPES = ['traditional', 'advisory', 'hybrid', 'supervisory'];
const CEO_TYPES = ['founder', 'professional', 'interim', 'executive'];
const EXECUTIVE_TYPES = ['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'];
const MANAGEMENT_TYPES = ['project', 'product', 'operations', 'hr', 'finance', 'marketing'];
const DEPARTMENT_TYPES = ['engineering', 'finance', 'hr', 'marketing', 'operations', 'sales', 'legal', 'research'];

export const CreateBlueprintForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState<string>("");
  const [boardType, setBoardType] = useState<string>("");
  const [ceoType, setCeoType] = useState<string>("");
  const [selectedExecutiveTypes, setSelectedExecutiveTypes] = useState<string[]>([]);
  const [selectedManagementTypes, setSelectedManagementTypes] = useState<string[]>([]);
  const [selectedDepartmentTypes, setSelectedDepartmentTypes] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('enterprise_blueprints')
        .insert([{
          name,
          enterprise_type: enterpriseType,
          board_type: boardType,
          ceo_type: ceoType,
          executive_types: selectedExecutiveTypes,
          management_types: selectedManagementTypes,
          department_types: selectedDepartmentTypes,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Enterprise blueprint created successfully",
      });

      // Reset form
      setName("");
      setEnterpriseType("");
      setBoardType("");
      setCeoType("");
      setSelectedExecutiveTypes([]);
      setSelectedManagementTypes([]);
      setSelectedDepartmentTypes([]);

      // Refresh blueprints list
      queryClient.invalidateQueries({ queryKey: ['enterpriseBlueprints'] });
    } catch (error) {
      console.error('Error creating blueprint:', error);
      toast({
        title: "Error",
        description: "Failed to create enterprise blueprint",
        variant: "destructive",
      });
    }
  };

  const handleTypeSelection = (value: string, setter: (value: string[]) => void, currentSelected: string[]) => {
    const updatedSelection = currentSelected.includes(value)
      ? currentSelected.filter(type => type !== value)
      : [...currentSelected, value];
    setter(updatedSelection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Blueprint Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="enterpriseType">Enterprise Type</Label>
        <Select value={enterpriseType} onValueChange={setEnterpriseType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select enterprise type" />
          </SelectTrigger>
          <SelectContent>
            {ENTERPRISE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="boardType">Board Type</Label>
        <Select value={boardType} onValueChange={setBoardType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select board type" />
          </SelectTrigger>
          <SelectContent>
            {BOARD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ceoType">CEO Type</Label>
        <Select value={ceoType} onValueChange={setCeoType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select CEO type" />
          </SelectTrigger>
          <SelectContent>
            {CEO_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Executive Types</Label>
        <div className="flex flex-wrap gap-2">
          {EXECUTIVE_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={selectedExecutiveTypes.includes(type) ? "default" : "outline"}
              onClick={() => handleTypeSelection(type, setSelectedExecutiveTypes, selectedExecutiveTypes)}
              className="text-sm"
            >
              {type.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Management Types</Label>
        <div className="flex flex-wrap gap-2">
          {MANAGEMENT_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={selectedManagementTypes.includes(type) ? "default" : "outline"}
              onClick={() => handleTypeSelection(type, setSelectedManagementTypes, selectedManagementTypes)}
              className="text-sm"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Department Types</Label>
        <div className="flex flex-wrap gap-2">
          {DEPARTMENT_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={selectedDepartmentTypes.includes(type) ? "default" : "outline"}
              onClick={() => handleTypeSelection(type, setSelectedDepartmentTypes, selectedDepartmentTypes)}
              className="text-sm"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Blueprint
      </Button>
    </form>
  );
};