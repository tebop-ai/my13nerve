import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import type { DepartmentType } from "@/types/enterprise";

interface DepartmentSectionProps {
  selectedDepartments: DepartmentType[];
  onDepartmentSelect: (type: DepartmentType) => void;
}

export const DepartmentSection = ({
  selectedDepartments,
  onDepartmentSelect
}: DepartmentSectionProps) => {
  return (
    <div className="space-y-6">
      {selectedDepartments.map((department) => (
        <div key={department} className="space-y-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-primary-dark">
            {department.charAt(0).toUpperCase() + department.slice(1)} Department
          </h3>
          <TypeSelectionGroup
            label="Executive Types"
            types={['cto', 'cfo', 'coo', 'cmo', 'chro', 'cio'] as const}
            selectedTypes={[]}
            onTypeSelect={() => {}}
          />
          <TypeSelectionGroup
            label="Management Types"
            types={['project', 'product', 'operations', 'hr', 'finance', 'marketing'] as const}
            selectedTypes={[]}
            onTypeSelect={() => {}}
          />
          {department === 'accounting' && (
            <AccountingTasksTable
              selectedTasks={[]}
              onTaskSelect={() => {}}
            />
          )}
        </div>
      ))}
    </div>
  );
};