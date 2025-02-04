import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AccountingTask {
  Occurrence: string;
  Code: string;
  "Sub-Task": string;
  "Full Description": string;
  Tools: string;
}

interface TaskGroup {
  [key: string]: AccountingTask[];
}

export const AccountingTasksTable = ({
  selectedTasks,
  onTaskSelect,
}: {
  selectedTasks: string[];
  onTaskSelect: (taskId: string) => void;
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['accountingTasks'],
    queryFn: async () => {
      console.log("Fetching accounting tasks...");
      const { data, error } = await supabase
        .from('Accounting')
        .select('*');

      if (error) {
        console.error("Error fetching accounting tasks:", error);
        throw error;
      }

      console.log("Fetched accounting tasks:", data);
      return data as AccountingTask[];
    },
  });

  if (isLoading) {
    return <div>Loading accounting tasks...</div>;
  }

  if (!tasks?.length) {
    return <div>No accounting tasks available</div>;
  }

  // Group tasks by occurrence
  const groupedTasks = tasks.reduce((acc: TaskGroup, task) => {
    const group = task.Occurrence || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(task);
    return acc;
  }, {});

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <Collapsible
          key={group}
          open={openGroups[group]}
          onOpenChange={() => toggleGroup(group)}
          className="border rounded-md bg-background"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent">
            <h4 className="font-medium">{group} Tasks</h4>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openGroups[group] ? "transform rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="relative">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Sub-Task</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tools</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupTasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.Code)}
                          onCheckedChange={() => onTaskSelect(task.Code)}
                        />
                      </TableCell>
                      <TableCell>{task.Code}</TableCell>
                      <TableCell>{task["Sub-Task"]}</TableCell>
                      <TableCell>{task["Full Description"]}</TableCell>
                      <TableCell>{task.Tools}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};