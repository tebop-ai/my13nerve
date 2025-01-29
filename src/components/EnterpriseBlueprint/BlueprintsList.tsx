import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const BlueprintsList = () => {
  const { data: blueprints } = useQuery({
    queryKey: ['enterpriseBlueprints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (!blueprints?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No enterprise blueprints created yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blueprints.map((blueprint) => (
        <Card key={blueprint.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{blueprint.name}</h3>
            <Badge variant="outline">
              {blueprint.enterprise_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          
          <div className="grid gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Board Type</p>
              <p className="text-muted-foreground">{blueprint.board_type}</p>
            </div>
            
            <div>
              <p className="font-medium mb-1">CEO Type</p>
              <p className="text-muted-foreground">{blueprint.ceo_type}</p>
            </div>
            
            <div>
              <p className="font-medium mb-1">Executive Types</p>
              <div className="flex flex-wrap gap-1">
                {blueprint.executive_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-1">Management Types</p>
              <div className="flex flex-wrap gap-1">
                {blueprint.management_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-1">Department Types</p>
              <div className="flex flex-wrap gap-1">
                {blueprint.department_types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};