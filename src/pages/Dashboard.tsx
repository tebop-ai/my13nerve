import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Building2, Settings, UserCheck, UserX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();

  const { data: applications, refetch } = useQuery({
    queryKey: ['adminApplications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_profile_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleApplicationStatus = async (id: string, status: 'approved' | 'declined') => {
    try {
      const { error } = await supabase
        .from('admin_profile_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Application ${status}`,
        description: `The admin application has been ${status}.`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, Goapele Main
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 gap-4 bg-muted p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="enterprises" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Enterprises
          </TabsTrigger>
          <TabsTrigger value="admin-applications" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Admin Applications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold">1,234</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Active Enterprises</h3>
                <p className="text-3xl font-bold">56</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Monthly Growth</h3>
                <p className="text-3xl font-bold text-green-600">+12%</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="space-y-4">
              <p>User management interface will be implemented here.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="enterprises">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Enterprise Management</h2>
            <div className="space-y-4">
              <p>Enterprise management interface will be implemented here.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="admin-applications">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Admin Applications</h2>
            <div className="space-y-6">
              {applications?.map((application) => (
                <Card key={application.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{application.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{application.email}</p>
                    </div>
                    <div className="space-x-2">
                      {application.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApplicationStatus(application.id, 'approved')}
                            variant="default"
                            size="sm"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleApplicationStatus(application.id, 'declined')}
                            variant="destructive"
                            size="sm"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </>
                      )}
                      {application.status === 'approved' && (
                        <div className="text-green-600 font-medium">
                          Approved | SuperCode: {application.generated_supercode}
                        </div>
                      )}
                      {application.status === 'declined' && (
                        <div className="text-red-600 font-medium">
                          Declined
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Current Position</p>
                      <p>{application.current_job_title}</p>
                    </div>
                    <div>
                      <p className="font-medium">Industry Expertise</p>
                      <p>{application.industry_expertise}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Purpose Statement</p>
                    <p className="mt-1">{application.purpose_statement}</p>
                  </div>
                </Card>
              ))}
              {applications?.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No pending admin applications
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
            <div className="space-y-4">
              <p>System settings interface will be implemented here.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;