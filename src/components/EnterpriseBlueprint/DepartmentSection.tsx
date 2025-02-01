import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import type { 
  ExecutiveType,
  ManagementType,
  BusinessFunctionType
} from "@/types/enterprise";

const EXECUTIVE_TYPES = ['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'] as const;
const MANAGEMENT_TYPES = ['project', 'product', 'operations', 'hr', 'finance', 'marketing'] as const;

interface DepartmentSectionProps {
  selectedBusinessFunctions: BusinessFunctionType[];
  selectedExecutiveTypes: ExecutiveType[];
  onExecutiveTypeSelect: (type: ExecutiveType) => void;
  selectedManagementTypes: ManagementType[];
  onManagementTypeSelect: (type: ManagementType) => void;
  selectedAccountingTasks: string[];
  onAccountingTaskSelect: (taskId: string) => void;
}

export const DepartmentSection = ({
  selectedBusinessFunctions,
  selectedExecutiveTypes,
  onExecutiveTypeSelect,
  selectedManagementTypes,
  onManagementTypeSelect,
  selectedAccountingTasks,
  onAccountingTaskSelect
}: DepartmentSectionProps) => {
  return (
    <div className="space-y-6">
      {selectedBusinessFunctions.map((function_type) => (
        <div key={function_type} className="space-y-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-primary-dark">
            {function_type.charAt(0).toUpperCase() + function_type.slice(1)} Department
          </h3>
          <TypeSelectionGroup
            label="Executive Types"
            types={EXECUTIVE_TYPES}
            selectedTypes={selectedExecutiveTypes}
            onTypeSelect={onExecutiveTypeSelect}
          />
          <TypeSelectionGroup
            label="Management Types"
            types={MANAGEMENT_TYPES}
            selectedTypes={selectedManagementTypes}
            onTypeSelect={onManagementTypeSelect}
          />
          {function_type === 'finance' && (
            <AccountingTasksTable
              selectedTasks={selectedAccountingTasks}
              onTaskSelect={onAccountingTaskSelect}
            />
          )}
        </div>
      ))}
    </div>
  );
};