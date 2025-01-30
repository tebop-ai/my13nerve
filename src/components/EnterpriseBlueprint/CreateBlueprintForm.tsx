import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import { TypeSelectionGroup } from "./TypeSelectionGroup";
import type { 
  EnterpriseType, 
  BoardType, 
  CEOType,
  ExecutiveType,
  ManagementType,
  DepartmentType 
} from "@/types/enterprise";

const EXECUTIVE_TYPES = ['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'] as const;
const MANAGEMENT_TYPES = ['project', 'product', 'operations', 'hr', 'finance', 'marketing'] as const;
const DEPARTMENT_TYPES = [
  'accounting',
  'financial_planning',
  'treasury',
  'risk_management',
  'internal_audit',
  'tax',
  'investor_relations',
  'compliance',
  'procurement',
  'strategic_finance',
  'it_finance'
] as const;

interface CreateBlueprintFormProps {
  onSuccess?: () => void;
}

export const CreateBlueprintForm = ({ onSuccess }: CreateBlueprintFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType | "">("");
  const [boardType, setBoardType] = useState<BoardType | "">("");
  const [ceoType, setCeoType] = useState<CEOType | "">("");
  const [selectedExecutiveTypes, setSelectedExecutiveTypes] = useState<ExecutiveType[]>([]);
  const [selectedManagementTypes, setSelectedManagementTypes] = useState<ManagementType[]>([]);
  const [selectedDepartmentTypes, setSelectedDepartmentTypes] = useState<DepartmentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExecutiveTypeSelect = (type: ExecutiveType) => {
    setSelectedExecutiveTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleManagementTypeSelect = (type: ManagementType) => {
    setSelectedManagementTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDepartmentTypeSelect = (type: DepartmentType) => {
    setSelectedDepartmentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !enterpriseType || !boardType || !ceoType || 
        selectedExecutiveTypes.length === 0 || 
        selectedManagementTypes.length === 0 || 
        selectedDepartmentTypes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting blueprint with data:", {
        name,
        enterpriseType,
        boardType,
        ceoType,
        selectedExecutiveTypes,
        selectedManagementTypes,
        selectedDepartmentTypes
      });

      const { data, error } = await supabase
        .from("enterprise_blueprints")
        .insert([{
          name,
          enterprise_type: enterpriseType,
          board_type: boardType,
          ceo_type: ceoType,
          executive_types: selectedExecutiveTypes,
          management_types: selectedManagementTypes,
          department_types: selectedDepartmentTypes,
          is_active: true
        }])
        .select();

      if (error) {
        console.error("Error creating blueprint:", error);
        throw error;
      }

      console.log("Blueprint created successfully:", data);

      toast({
        title: "Success",
        description: "Blueprint created successfully",
      });

      // Reset form
      setName("");
      setEnterpriseType("");
      setBoardType("");
      setCeoType("");
      setSelectedExecutiveTypes([]);
      setSelectedManagementTypes([]);
      setSelectedDepartmentTypes([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating blueprint:", error);
      toast({
        title: "Error",
        description: "Failed to create blueprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
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
          onTypeSelect={handleExecutiveTypeSelect}
        />

        <TypeSelectionGroup
          label="Management Types"
          types={MANAGEMENT_TYPES}
          selectedTypes={selectedManagementTypes}
          onTypeSelect={handleManagementTypeSelect}
        />

        <TypeSelectionGroup
          label="Department Types"
          types={DEPARTMENT_TYPES}
          selectedTypes={selectedDepartmentTypes}
          onTypeSelect={handleDepartmentTypeSelect}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Blueprint..." : "Create Blueprint"}
        </Button>
      </form>
    </Card>
  );
};