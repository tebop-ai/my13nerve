import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLoginForm } from "@/components/login/AdminLoginForm";
import { EnterpriseLoginForm } from "@/components/login/EnterpriseLoginForm";
import { Logo } from "@/components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4 h-12" />
        </div>

        <Tabs defaultValue="admins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="users">Enterprise Users</TabsTrigger>
            <TabsTrigger value="admins" className="text-gray-600">Access Admin Panel</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <EnterpriseLoginForm />
          </TabsContent>

          <TabsContent value="admins">
            <AdminLoginForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;