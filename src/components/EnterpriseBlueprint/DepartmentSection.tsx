import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import type { DepartmentType } from "@/types/enterprise";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DepartmentSectionProps {
  selectedDepartments: DepartmentType[];
  onDepartmentSelect: (type: DepartmentType) => void;
}

export const DepartmentSection = ({
  selectedDepartments,
  onDepartmentSelect
}: DepartmentSectionProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (department: string) => {
    setOpenSections(prev => ({
      ...prev,
      [department]: !prev[department]
    }));
  };

  return (
    <div className="space-y-6">
      {selectedDepartments.map((department) => (
        <Collapsible
          key={department}
          open={openSections[department]}
          onOpenChange={() => toggleSection(department)}
          className="border rounded-lg bg-white shadow"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
            <h3 className="text-lg font-medium text-primary-dark">
              {department.charAt(0).toUpperCase() + department.slice(1)} Department
            </h3>
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform duration-200",
              openSections[department] ? "transform rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 space-y-4">
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
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};