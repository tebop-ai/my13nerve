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
  // First fetch the user's profile to get their enterprise_id
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

  // Then fetch the blueprint using the enterprise_id
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