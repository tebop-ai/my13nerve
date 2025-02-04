import React from 'react';
import { TimelineView } from '@/components/Timeline/TimelineView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CSVTask {
  'Sub-Task': string;
  'Full Description': string;
  Occurrence: string;
}

const Index = () => {
  const { data: blueprint, isLoading, error } = useQuery({
    queryKey: ['blueprint', 'Demo 1'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('name', 'Demo 1')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !blueprint) {
    return <div>No blueprint found with name "Demo 1"</div>;
  }

  // Ensure csv_tasks is an array and has the correct shape
  const csvTasks = Array.isArray(blueprint.csv_tasks) 
    ? (blueprint.csv_tasks as unknown as CSVTask[])
    : [] as CSVTask[];

  return (
    <div className="container mx-auto p-6">
      <TimelineView
        enterpriseId={blueprint.id}
        csvTasks={csvTasks}
      />
    </div>
  );
};

export default Index;