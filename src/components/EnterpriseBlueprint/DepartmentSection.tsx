import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import type { DepartmentType } from "@/types/enterprise";

interface DepartmentSectionProps {
  selectedBusinessFunctions: string[];
  selectedExecutiveTypes: string[];
  onExecutiveTypeSelect: (type: string) => void;
  selectedManagementTypes: string[];
  onManagementTypeSelect: (type: string) => void;
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
            types={['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'] as const}
            selectedTypes={selectedExecutiveTypes}
            onTypeSelect={onExecutiveTypeSelect}
          />
          <TypeSelectionGroup
            label="Management Types"
            types={['project', 'product', 'operations', 'hr', 'finance', 'marketing'] as const}
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