import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface AccountingTask {
  Occurrence: string;
  Code: string;
  "Sub-Task": string;
  "Full Description": string;
  Tools: string;
}

export const AccountingTasksTable = ({
  selectedTasks,
  onTaskSelect,
}: {
  selectedTasks: string[];
  onTaskSelect: (taskId: string) => void;
}) => {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Sub-Task</TableHead>
            <TableHead>Occurrence</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tools</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedTasks.includes(task.Code)}
                  onCheckedChange={() => onTaskSelect(task.Code)}
                />
              </TableCell>
              <TableCell>{task.Code}</TableCell>
              <TableCell>{task["Sub-Task"]}</TableCell>
              <TableCell>{task.Occurrence}</TableCell>
              <TableCell>{task["Full Description"]}</TableCell>
              <TableCell>{task.Tools}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};