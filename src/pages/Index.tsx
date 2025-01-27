import { Card } from "@/components/ui/card";
import { Users, Building2, Globe, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to my13nerve Business Co-pilot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-semibold">24</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Enterprises</p>
                <p className="text-2xl font-semibold">156</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Global Reach</p>
                <p className="text-2xl font-semibold">28</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-semibold">+12%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Admin Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Admin Profile Created</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Enterprise Distribution</h2>
            <div className="space-y-4">
              {[
                { type: "Regional/Local", count: 45 },
                { type: "National", count: 67 },
                { type: "Continental", count: 28 },
                { type: "Global Multi-National", count: 16 },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-primary font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;