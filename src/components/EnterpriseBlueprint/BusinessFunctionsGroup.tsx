import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BusinessFunctionType, DepartmentCategoryType } from "@/types/enterprise";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BusinessFunctionsGroupProps {
  selectedFunctions: BusinessFunctionType[];
  onFunctionSelect: (type: BusinessFunctionType) => void;
  selectedCategories: DepartmentCategoryType[];
  onCategorySelect: (type: DepartmentCategoryType) => void;
}

const DEPARTMENT_CATEGORIES: Record<BusinessFunctionType, { name: string; categories: DepartmentCategoryType[] }> = {
  finance: {
    name: "Finance",
    categories: ['accounting', 'financial_planning', 'treasury', 'risk_management', 'internal_audit', 'tax', 'investor_relations', 'compliance', 'procurement', 'strategic_finance', 'it_finance']
  },
  marketing: {
    name: "Marketing",
    categories: ['brand_management', 'digital_marketing', 'market_research', 'advertising', 'public_relations', 'content_marketing', 'social_media', 'event_marketing', 'product_marketing', 'performance_marketing', 'crm', 'trade_marketing']
  },
  procurement: {
    name: "Procurement",
    categories: ['vendor_management', 'contract_negotiation', 'cost_optimization', 'category_management', 'purchase_order_processing', 'logistics_coordination', 'procurement_compliance', 'inventory_management', 'strategic_procurement']
  },
  human_resources: {
    name: "Human Resources",
    categories: ['talent_acquisition', 'employee_relations', 'learning_development', 'compensation_benefits', 'hr_compliance', 'dei', 'workforce_planning', 'organizational_development', 'hr_technology', 'employee_wellbeing']
  },
  operations: {
    name: "Operations",
    categories: ['manufacturing', 'supply_chain', 'quality_control', 'process_improvement', 'facilities_management', 'customer_support_ops', 'business_continuity', 'operational_excellence', 'sustainability', 'performance_monitoring']
  },
  support: {
    name: "Support",
    categories: []
  }
};

const formatLabel = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const BusinessFunctionsGroup = ({
  selectedFunctions,
  onFunctionSelect,
  selectedCategories,
  onCategorySelect
}: BusinessFunctionsGroupProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Business Functions</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DEPARTMENT_CATEGORIES) as BusinessFunctionType[]).map((type) => (
            <Button
              key={type}
              type="button"
              variant={selectedFunctions.includes(type) ? "default" : "outline"}
              onClick={() => onFunctionSelect(type)}
              className="text-sm"
            >
              {DEPARTMENT_CATEGORIES[type].name}
            </Button>
          ))}
        </div>
      </div>

      {selectedFunctions.length > 0 && (
        <div className="space-y-4">
          {selectedFunctions.map((func) => (
            <div key={func} className="space-y-2">
              <Label>{DEPARTMENT_CATEGORIES[func].name} Departments ({DEPARTMENT_CATEGORIES[func].categories.length})</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENT_CATEGORIES[func].categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      onClick={() => onCategorySelect(category)}
                      className="text-sm"
                    >
                      {formatLabel(category)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};