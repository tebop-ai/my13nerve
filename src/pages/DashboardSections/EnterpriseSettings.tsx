import { Card } from "@/components/ui/card";
import { CreateBlueprintForm } from "@/components/EnterpriseBlueprint/CreateBlueprintForm";
import { BlueprintsList } from "@/components/EnterpriseBlueprint/BlueprintsList";
import { useToast } from "@/hooks/use-toast";

export const EnterpriseSettings = () => {
  const { toast } = useToast();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Enterprise Blueprints</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Create New Blueprint</h3>
              <CreateBlueprintForm onSuccess={() => {
                toast({
                  title: "Success",
                  description: "Blueprint created successfully",
                });
              }} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Existing Blueprints</h3>
              <BlueprintsList />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};