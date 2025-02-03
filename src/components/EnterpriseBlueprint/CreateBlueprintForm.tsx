import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlueprintTabs } from "./BlueprintTabs";
import type { 
  EnterpriseType, 
  BoardType, 
  CEOType,
  BusinessFunctionType,
  DepartmentCategoryType,
  DepartmentType
} from "@/types/enterprise";

export const CreateBlueprintForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType | "">("");
  const [boardType, setBoardType] = useState<BoardType | "">("");
  const [ceoType, setCeoType] = useState<CEOType | "">("");
  const [selectedBusinessFunctions, setSelectedBusinessFunctions] = useState<BusinessFunctionType[]>([]);
  const [selectedDepartmentCategories, setSelectedDepartmentCategories] = useState<DepartmentCategoryType[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentType[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

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

  const handleDepartmentSelect = (type: DepartmentType) => {
    setSelectedDepartments(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      console.info("Submitting blueprint:", {
        name,
        enterpriseType,
        boardType,
        ceoType,
        executiveTypes: [],
        managementTypes: [],
        departmentTypes: selectedDepartments
      });

      const { error } = await supabase
        .from('enterprise_blueprints')
        .insert([{  // Wrap the object in an array to match the expected type
          name,
          enterprise_type: enterpriseType,
          board_type: boardType,
          ceo_type: ceoType,
          executive_types: [],
          management_types: [],
          department_types: selectedDepartments,
          business_functions: selectedBusinessFunctions,
          department_categories: selectedDepartmentCategories,
          created_by: user.id
        }]);

      if (error) {
        console.error("Error creating blueprint:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Blueprint created successfully",
      });

      // Reset form
      setName("");
      setEnterpriseType("");
      setBoardType("");
      setCeoType("");
      setSelectedBusinessFunctions([]);
      setSelectedDepartmentCategories([]);
      setSelectedDepartments([]);
      setActiveTab("basic");

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
      selectedDepartments={selectedDepartments}
      onDepartmentSelect={handleDepartmentSelect}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
};