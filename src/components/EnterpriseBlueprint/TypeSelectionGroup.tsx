import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TypeSelectionGroupProps<T extends string> {
  label: string;
  types: readonly T[];
  selectedTypes: T[];
  onTypeSelect: (type: T) => void;
  formatLabel?: (type: string) => string;
}

export const TypeSelectionGroup = <T extends string>({
  label,
  types,
  selectedTypes,
  onTypeSelect,
  formatLabel = (type: string) => type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' '),
}: TypeSelectionGroupProps<T>) => {
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