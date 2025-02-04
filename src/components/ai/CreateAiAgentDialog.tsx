import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cog, Database, Upload, Check } from "lucide-react";
import { AccountingTasksTable } from "../EnterpriseBlueprint/AccountingTasksTable";

const INDUSTRY_TYPES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Other"
];

export const CreateAiAgentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch available tasks
  const { data: availableTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['availableTasks'],
    queryFn: async () => {
      console.log("Fetching available tasks...");
      const { data, error } = await supabase.rpc('get_available_tasks');
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      return data;
    }
  });

  // Create AI Agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async (agentData: {
      name: string;
      description: string;
      industryType: string;
      taskCapacities: any[];
    }) => {
      console.log("Creating AI agent:", agentData);
      const { data, error } = await supabase
        .from('ai_agents')
        .insert([{
          name: agentData.name,
          description: agentData.description,
          industry_type: agentData.industryType,
          task_capacities: agentData.taskCapacities,
          specifications: {
            version: "1.0",
            lastUpdated: new Date().toISOString(),
          }
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI Agent created successfully",
      });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating AI agent:", error);
      toast({
        title: "Error",
        description: "Failed to create AI Agent",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setIndustryType("");
    setSelectedTasks([]);
  };

  const handleCreate = () => {
    if (!name || !description || !industryType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const taskCapacities = availableTasks?.map(task => ({
      code: task.task_code,
      description: task.task_description,
      occurrence: task.occurrence,
      subTask: task.sub_task,
      tools: task.tools,
      tableSource: task.table_name
    })) || [];

    createAgentMutation.mutate({
      name,
      description,
      industryType,
      taskCapacities
    });
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Cog className="h-4 w-4" />
          Create AI Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the AI agent's purpose"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry Type</Label>
            <Select value={industryType} onValueChange={setIndustryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry type" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Available Tasks</Label>
            <AccountingTasksTable
              selectedTasks={selectedTasks}
              onTaskSelect={handleTaskSelect}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Database className="h-4 w-4" />
            <span>
              {tasksLoading
                ? "Loading available tasks..."
                : `${availableTasks?.length || 0} tasks available`}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <Button
            onClick={handleCreate}
            disabled={createAgentMutation.isPending}
            className="w-full"
          >
            {createAgentMutation.isPending ? (
              <Cog className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Create Agent
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};