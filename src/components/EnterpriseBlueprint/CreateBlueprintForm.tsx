import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import { TypeSelectionGroup } from "./TypeSelectionGroup";
import type { EnterpriseType, BoardType, CEOType, ExecutiveType, ManagementType, DepartmentType } from "@/types/enterprise";

const EXECUTIVE_TYPES = ['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'] as const;
const MANAGEMENT_TYPES = ['project', 'product', 'operations', 'hr', 'finance', 'marketing'] as const;
const DEPARTMENT_TYPES = ['accounting', 'financial_planning', 'treasury', 'risk_management', 'internal_audit', 'tax', 'investor_relations', 'compliance', 'procurement', 'strategic_finance', 'it_finance'] as const;

interface CreateBlueprintFormProps {
  onSuccess?: () => void;
}

export const CreateBlueprintForm = ({ onSuccess }: CreateBlueprintFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType | "">("");
  const [boardType, setBoardType] = useState<BoardType | "">("");
  const [ceoType, setCeoType] = useState<CEOType | "">("");
  const [selectedExecutiveTypes, setSelectedExecutiveTypes] = useState<ExecutiveType[]>([]);
  const [selectedManagementTypes, setSelectedManagementTypes] = useState<ManagementType[]>([]);
  const [selectedDepartmentTypes, setSelectedDepartmentTypes] = useState<DepartmentType[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enterpriseType || !boardType || !ceoType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

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
      
      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error('Error creating blueprint:', error);
      toast({
        title: "Error",
        description: "Failed to create enterprise blueprint",
        variant: "destructive",
      });
    }
  };

  const handleTypeSelection = <T extends string>(type: T, setter: (value: T[]) => void, currentSelected: T[]) => {
    const updatedSelection = currentSelected.includes(type)
      ? currentSelected.filter(t => t !== type)
      : [...currentSelected, type];
    setter(updatedSelection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BlueprintBasicInfo
        name={name}
        setName={setName}
        enterpriseType={enterpriseType}
        setEnterpriseType={setEnterpriseType}
        boardType={boardType}
        setBoardType={setBoardType}
        ceoType={ceoType}
        setCeoType={setCeoType}
      />

      <TypeSelectionGroup
        label="Executive Types"
        types={EXECUTIVE_TYPES}
        selectedTypes={selectedExecutiveTypes}
        onTypeSelect={(type) => handleTypeSelection(type as ExecutiveType, setSelectedExecutiveTypes, selectedExecutiveTypes)}
      />

      <TypeSelectionGroup
        label="Management Types"
        types={MANAGEMENT_TYPES}
        selectedTypes={selectedManagementTypes}
        onTypeSelect={(type) => handleTypeSelection(type as ManagementType, setSelectedManagementTypes, selectedManagementTypes)}
        formatLabel={(type) => type.charAt(0).toUpperCase() + type.slice(1)}
      />

      <TypeSelectionGroup
        label="Department Types"
        types={DEPARTMENT_TYPES}
        selectedTypes={selectedDepartmentTypes}
        onTypeSelect={(type) => handleTypeSelection(type as DepartmentType, setSelectedDepartmentTypes, selectedDepartmentTypes)}
      />

      <Button type="submit" className="w-full">
        Create Blueprint
      </Button>
    </form>
  );
};