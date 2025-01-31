import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import { BusinessFunctionsGroup } from "./BusinessFunctionsGroup";
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

  // Auto-switch to departments tab when a business function is selected
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger 
              value="basic"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="functions"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Business Functions
            </TabsTrigger>
            <TabsTrigger 
              value="departments"
              disabled={!name || !enterpriseType || !boardType || !ceoType}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
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
          </TabsContent>

          <TabsContent value="functions">
            <BusinessFunctionsGroup
              selectedFunctions={selectedBusinessFunctions}
              onFunctionSelect={handleBusinessFunctionSelect}
              selectedCategories={selectedDepartmentCategories}
              onCategorySelect={handleDepartmentCategorySelect}
            />
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            {selectedBusinessFunctions.map((function_type) => (
              <div key={function_type} className="space-y-4 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-primary-dark">{function_type.charAt(0).toUpperCase() + function_type.slice(1)} Department</h3>
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
                {function_type === 'finance' && (
                  <AccountingTasksTable
                    selectedTasks={selectedAccountingTasks}
                    onTaskSelect={handleAccountingTaskSelect}
                  />
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-dark text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Blueprint..." : "Create Blueprint"}
        </Button>
      </form>
    </Card>
  );
};
