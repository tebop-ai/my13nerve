import React from 'react';
import { TimelineView } from '@/components/Timeline/TimelineView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { data: blueprint } = useQuery({
    queryKey: ['blueprint', 'Demo 1'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('name', 'Demo 1')
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!blueprint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <TimelineView
        enterpriseId={blueprint.id}
        csvTasks={blueprint.csv_tasks || []}
      />
    </div>
  );
};

export default Index;