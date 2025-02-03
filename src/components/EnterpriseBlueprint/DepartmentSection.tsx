import { useState } from "react";
import { TypeSelectionGroup } from "./TypeSelectionGroup";
import { AccountingTasksTable } from "./AccountingTasksTable";
import type { DepartmentType } from "@/types/enterprise";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DepartmentSectionProps {
  selectedDepartments: DepartmentType[];
  onDepartmentSelect: (type: DepartmentType) => void;
}

// Map department types to their corresponding table names
const departmentTableMap = {
  accounting: "Accounting",
  customer_insights: "Customer Insights",
  marketing: "Marketing Comm",
  product_service: "Product_Service",
  research_development: "R&D_Ops"
} as const;

const fetchDepartmentTasks = async (department: DepartmentType) => {
  console.log('Fetching tasks for department:', department);
  const tableName = departmentTableMap[department];
  
  if (!tableName) {
    console.error('No table mapping found for department:', department);
    return [];
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) {
    console.error('Error fetching department tasks:', error);
    throw error;
  }
  
  console.log('Fetched tasks:', data);
  return data;
};

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

  // Create a query for each selected department
  const departmentQueries = selectedDepartments.map(department => ({
    department,
    ...useQuery({
      queryKey: ['departmentTasks', department],
      queryFn: () => fetchDepartmentTasks(department),
      enabled: openSections[department] // Only fetch when section is open
    })
  }));

  return (
    <div className="space-y-6">
      {departmentQueries.map(({ department, data: tasks, isLoading, error }) => (
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
            
            {isLoading ? (
              <div>Loading tasks...</div>
            ) : error ? (
              <div>Error loading tasks</div>
            ) : tasks && tasks.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Department Tasks</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sub-Task</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Occurrence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm">{task.Code}</td>
                        <td className="px-4 py-2 text-sm">{task['Sub-Task']}</td>
                        <td className="px-4 py-2 text-sm">{task['Full Description']}</td>
                        <td className="px-4 py-2 text-sm">{task.Occurrence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No tasks found for this department</div>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};