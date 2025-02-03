import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { DepartmentSection } from "./DepartmentSection";
import { BusinessFunctionsGroup } from "./BusinessFunctionsGroup";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import type { EnterpriseType, BoardType, CEOType, ExecutiveType, ManagementType, DepartmentType } from "@/types/enterprise";

export const CreateBlueprintForm = () => {
  const [name, setName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType>("startup");
  const [boardType, setBoardType] = useState<BoardType>("traditional");
  const [ceoType, setCeoType] = useState<CEOType>("founder");
  const [executiveTypes, setExecutiveTypes] = useState<ExecutiveType[]>([]);
  const [managementTypes, setManagementTypes] = useState<ManagementType[]>([]);
  const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>(["accounting"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !enterpriseType || !boardType || !ceoType || executiveTypes.length === 0 || managementTypes.length === 0 || departmentTypes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting blueprint:", {
        name,
        enterpriseType,
        boardType,
        ceoType,
        executiveTypes,
        managementTypes,
        departmentTypes
      });

      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .insert([
          {
            name,
            enterprise_type: enterpriseType,
            board_type: boardType,
            ceo_type: ceoType,
            executive_types: executiveTypes,
            management_types: managementTypes,
            department_types: departmentTypes,
            is_active: true
          }
        ])
        .select();

      if (error) throw error;

      console.log("Blueprint created successfully:", data);
      
      toast({
        title: "Success",
        description: "Enterprise blueprint created successfully",
      });

      // Reset form
      setName("");
      setEnterpriseType("startup");
      setBoardType("traditional");
      setCeoType("founder");
      setExecutiveTypes([]);
      setManagementTypes([]);
      setDepartmentTypes(["accounting"]);
      
    } catch (error) {
      console.error("Error creating blueprint:", error);
      toast({
        title: "Error",
        description: "Failed to create enterprise blueprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
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
      </Card>

      <Card className="p-6">
        <TypeSelectionGroup
          label="Executive Types"
          types={["cto", "cfo", "coo", "cmo", "chro", "cio"] as const}
          selectedTypes={executiveTypes}
          onTypeSelect={(type) => {
            if (executiveTypes.includes(type)) {
              setExecutiveTypes(executiveTypes.filter(t => t !== type));
            } else {
              setExecutiveTypes([...executiveTypes, type]);
            }
          }}
        />
        <TypeSelectionGroup
          label="Management Types"
          types={["project", "product", "operations", "hr", "finance", "marketing"] as const}
          selectedTypes={managementTypes}
          onTypeSelect={(type) => {
            if (managementTypes.includes(type)) {
              setManagementTypes(managementTypes.filter(t => t !== type));
            } else {
              setManagementTypes([...managementTypes, type]);
            }
          }}
        />
      </Card>

      <Card className="p-6">
        <DepartmentSection
          selectedDepartments={departmentTypes}
          onDepartmentSelect={(type) => {
            if (departmentTypes.includes(type)) {
              setDepartmentTypes(departmentTypes.filter(t => t !== type));
            } else {
              setDepartmentTypes([...departmentTypes, type]);
            }
          }}
        />
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Creating..." : "Create Blueprint"}
        </Button>
      </div>
    </form>
  );
};