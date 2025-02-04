import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CreateAiAgentDialog } from "@/components/ai/CreateAiAgentDialog";
import { Sparkles, Bot, AlertCircle } from "lucide-react";

const AiAgents = () => {
  const { data: aiAgents, isLoading } = useQuery({
    queryKey: ['aiAgents'],
    queryFn: async () => {
      console.log("Fetching AI agents...");
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching AI agents:", error);
        throw error;
      }
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 bg-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bot className="h-10 w-10 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
            <p className="text-gray-600">Manage your AI agent configurations</p>
          </div>
        </div>
        <CreateAiAgentDialog />
      </div>

      {aiAgents?.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Agents Found</h3>
          <p className="text-gray-600 mb-6">Start by creating your first AI agent using the button above.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aiAgents?.map((agent) => (
            <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-gray-600" />
                  <h3 className="font-semibold text-lg text-gray-900">{agent.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  agent.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{agent.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Industry: {agent.industry_type}</span>
                <span>v{agent.version}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiAgents;