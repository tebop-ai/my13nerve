import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TimelineView } from '@/components/Timeline/TimelineView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface CSVTask {
  'Sub-Task': string;
  'Full Description': string;
  Occurrence: string;
}

const EnterpriseView = () => {
  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      console.log('Fetching user profile...');
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'info@13thai.com')
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      console.log('User profile:', profile);
      return profile;
    },
  });

  const { data: blueprint, isLoading: blueprintLoading, error } = useQuery({
    queryKey: ['blueprint', userProfile?.enterprise_id],
    queryFn: async () => {
      if (!userProfile?.enterprise_id) return null;
      
      console.log('Fetching blueprint for enterprise:', userProfile.enterprise_id);
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('id', userProfile.enterprise_id)
        .maybeSingle();

      if (error) throw error;
      console.log('Blueprint data:', data);
      return data;
    },
    enabled: !!userProfile?.enterprise_id,
  });

  if (userLoading || blueprintLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !blueprint) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Blueprint Found</h2>
          <p className="text-gray-600">Please contact your administrator to set up your enterprise blueprint.</p>
        </div>
      </div>
    );
  }

  const csvTasks = Array.isArray(blueprint.csv_tasks) 
    ? (blueprint.csv_tasks as unknown as CSVTask[])
    : [] as CSVTask[];

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <TimelineView
            enterpriseId={blueprint.id}
            csvTasks={csvTasks}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <div className="space-y-4">
              {csvTasks.map((task, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold">{task['Sub-Task']}</h3>
                  <p className="text-gray-600">{task['Full Description']}</p>
                  <p className="text-sm text-gray-500">Occurrence: {task.Occurrence}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <h2 className="text-2xl font-bold">Reports</h2>
            <p className="text-gray-600">Coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseView;