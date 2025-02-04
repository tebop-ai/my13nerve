import React from 'react';
import { TimelineView } from '@/components/Timeline/TimelineView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CSVTask {
  'Sub-Task': string;
  'Full Description': string;
  Occurrence: string;
}

const Index = () => {
  const { toast } = useToast();
  const userEmail = sessionStorage.getItem('userEmail');

  // First fetch the user's profile to get their enterprise_id
  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      console.log('Fetching user profile for email:', userEmail);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      console.log('User profile found:', profile);
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

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load enterprise data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (userLoading || blueprintLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile?.enterprise_id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-2">No Enterprise Access</h2>
          <p className="text-gray-600">
            You don't have access to any enterprise yet. Please contact your administrator to get access.
          </p>
        </div>
      </div>
    );
  }

  if (error || !blueprint) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-2">Enterprise Not Found</h2>
          <p className="text-gray-600">
            The enterprise data could not be loaded. Please ensure you have the correct permissions and try again.
          </p>
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