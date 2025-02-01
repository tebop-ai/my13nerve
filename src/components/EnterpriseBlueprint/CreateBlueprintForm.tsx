import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlueprintTabs } from "./BlueprintTabs";
import type { 
  EnterpriseType, 
  BoardType, 
  CEOType,
  ExecutiveType,
  ManagementType,
  DepartmentType,
  BusinessFunctionType,
  DepartmentCategoryType
} from "@/types/enterprise";

export interface CreateBlueprintFormProps {
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
  const [selectedAccountingTasks, setSelectedAccountingTasks] = useState<string[]>([]);
  const [selectedBusinessFunctions, setSelectedBusinessFunctions] = useState<BusinessFunctionType[]>([]);
  const [selectedDepartmentCategories, setSelectedDepartmentCategories] = useState<DepartmentCategoryType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("basic");

  useEffect(() => {
    if (selectedBusinessFunctions.length > 0) {
      setActiveTab("departments");
    }
  }, [selectedBusinessFunctions]);

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

  const handleBusinessFunctionSelect = (type: BusinessFunctionType) => {
    setSelectedBusinessFunctions(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleDepartmentCategorySelect = (type: DepartmentCategoryType) => {
    setSelectedDepartmentCategories(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAccountingTaskSelect = (taskId: string) => {
    setSelectedAccountingTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !enterpriseType || !boardType || !ceoType || 
        selectedExecutiveTypes.length === 0 || 
        selectedManagementTypes.length === 0 || 
        selectedBusinessFunctions.length === 0) {
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
        selectedDepartmentTypes,
        selectedAccountingTasks,
        selectedBusinessFunctions,
        selectedDepartmentCategories
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
          accounting_tasks: selectedAccountingTasks,
          business_functions: selectedBusinessFunctions,
          department_categories: selectedDepartmentCategories,
          is_active: true
        }])
        .select();

      if (error) throw error;

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
      setSelectedAccountingTasks([]);
      setSelectedBusinessFunctions([]);
      setSelectedDepartmentCategories([]);
      setActiveTab("basic");

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
    <Card className="p-6 bg-primary-light border-primary">
      <BlueprintTabs
        name={name}
        setName={setName}
        enterpriseType={enterpriseType}
        setEnterpriseType={setEnterpriseType}
        boardType={boardType}
        setBoardType={setBoardType}
        ceoType={ceoType}
        setCeoType={setCeoType}
        selectedBusinessFunctions={selectedBusinessFunctions}
        onBusinessFunctionSelect={handleBusinessFunctionSelect}
        selectedDepartmentCategories={selectedDepartmentCategories}
        onDepartmentCategorySelect={handleDepartmentCategorySelect}
        selectedExecutiveTypes={selectedExecutiveTypes}
        onExecutiveTypeSelect={handleExecutiveTypeSelect}
        selectedManagementTypes={selectedManagementTypes}
        onManagementTypeSelect={handleManagementTypeSelect}
        selectedAccountingTasks={selectedAccountingTasks}
        onAccountingTaskSelect={handleAccountingTaskSelect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};