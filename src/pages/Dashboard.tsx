import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Building2, Settings } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, Goapele Main
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-muted p-1">
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