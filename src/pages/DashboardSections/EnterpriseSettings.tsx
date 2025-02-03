import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateBlueprintForm } from "@/components/EnterpriseBlueprint/CreateBlueprintForm";
import { BlueprintsList } from "@/components/EnterpriseBlueprint/BlueprintsList";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const EnterpriseSettings = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("createBlueprint") ? "create" : "existing";

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Enterprise Blueprints</h2>
        
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Blueprints</TabsTrigger>
            <TabsTrigger value="create">Create New Blueprint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4">
            <BlueprintsList />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <CreateBlueprintForm />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};