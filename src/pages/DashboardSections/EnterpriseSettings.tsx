import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateBlueprintForm } from "@/components/EnterpriseBlueprint/CreateBlueprintForm";
import { BlueprintsList } from "@/components/EnterpriseBlueprint/BlueprintsList";
import { useToast } from "@/hooks/use-toast";

export const EnterpriseSettings = () => {
  const { toast } = useToast();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Enterprise Blueprints</h2>
        
        <Tabs defaultValue="existing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Blueprints</TabsTrigger>
            <TabsTrigger value="create">Create New Blueprint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4">
            <BlueprintsList />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <CreateBlueprintForm 
              onSuccess={() => {
                toast({
                  title: "Success",
                  description: "Blueprint created successfully",
                });
              }} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};