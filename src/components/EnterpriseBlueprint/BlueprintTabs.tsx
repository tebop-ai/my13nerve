import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import { BusinessFunctionsGroup } from "./BusinessFunctionsGroup";
import { DepartmentSection } from "./DepartmentSection";
import type { 
  EnterpriseType, 
  BoardType, 
  CEOType,
  ExecutiveType,
  ManagementType,
  BusinessFunctionType,
  DepartmentCategoryType
} from "@/types/enterprise";

interface BlueprintTabsProps {
  name: string;
  setName: (name: string) => void;
  enterpriseType: EnterpriseType | "";
  setEnterpriseType: (type: EnterpriseType | "") => void;
  boardType: BoardType | "";
  setBoardType: (type: BoardType | "") => void;
  ceoType: CEOType | "";
  setCeoType: (type: CEOType | "") => void;
  selectedBusinessFunctions: BusinessFunctionType[];
  onBusinessFunctionSelect: (type: BusinessFunctionType) => void;
  selectedDepartmentCategories: DepartmentCategoryType[];
  onDepartmentCategorySelect: (type: DepartmentCategoryType) => void;
  selectedExecutiveTypes: ExecutiveType[];
  onExecutiveTypeSelect: (type: ExecutiveType) => void;
  selectedManagementTypes: ManagementType[];
  onManagementTypeSelect: (type: ManagementType) => void;
  selectedAccountingTasks: string[];
  onAccountingTaskSelect: (taskId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const BlueprintTabs = ({
  name,
  setName,
  enterpriseType,
  setEnterpriseType,
  boardType,
  setBoardType,
  ceoType,
  setCeoType,
  selectedBusinessFunctions,
  onBusinessFunctionSelect,
  selectedDepartmentCategories,
  onDepartmentCategorySelect,
  selectedExecutiveTypes,
  onExecutiveTypeSelect,
  selectedManagementTypes,
  onManagementTypeSelect,
  selectedAccountingTasks,
  onAccountingTaskSelect,
  activeTab,
  setActiveTab,
  isSubmitting,
  onSubmit
}: BlueprintTabsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            onFunctionSelect={onBusinessFunctionSelect}
            selectedCategories={selectedDepartmentCategories}
            onCategorySelect={onDepartmentCategorySelect}
          />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentSection 
            selectedBusinessFunctions={selectedBusinessFunctions}
            selectedExecutiveTypes={selectedExecutiveTypes}
            onExecutiveTypeSelect={onExecutiveTypeSelect}
            selectedManagementTypes={selectedManagementTypes}
            onManagementTypeSelect={onManagementTypeSelect}
            selectedAccountingTasks={selectedAccountingTasks}
            onAccountingTaskSelect={onAccountingTaskSelect}
          />
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
  );
};