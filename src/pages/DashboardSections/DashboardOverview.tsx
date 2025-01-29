import { Card } from "@/components/ui/card";

export const DashboardOverview = () => {
  return (
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
  );
};