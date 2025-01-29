import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TypeSelectionGroupProps {
  label: string;
  types: string[];
  selectedTypes: string[];
  onTypeSelect: (type: string) => void;
  formatLabel?: (type: string) => string;
}

export const TypeSelectionGroup = ({
  label,
  types,
  selectedTypes,
  onTypeSelect,
  formatLabel = (type: string) => type.toUpperCase(),
}: TypeSelectionGroupProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <Button
            key={type}
            type="button"
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            onClick={() => onTypeSelect(type)}
            className="text-sm"
          >
            {formatLabel(type)}
          </Button>
        ))}
      </div>
    </div>
  );
};