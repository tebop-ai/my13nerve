import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlueprintBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  enterpriseType: string;
  setEnterpriseType: (value: string) => void;
  boardType: string;
  setBoardType: (value: string) => void;
  ceoType: string;
  setCeoType: (value: string) => void;
}

const ENTERPRISE_TYPES = ['startup', 'small_business', 'medium_business', 'corporation', 'non_profit', 'government'];
const BOARD_TYPES = ['traditional', 'advisory', 'hybrid', 'supervisory'];
const CEO_TYPES = ['founder', 'professional', 'interim', 'executive'];

export const BlueprintBasicInfo = ({
  name,
  setName,
  enterpriseType,
  setEnterpriseType,
  boardType,
  setBoardType,
  ceoType,
  setCeoType,
}: BlueprintBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Blueprint Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="enterpriseType">Enterprise Type</Label>
        <Select value={enterpriseType} onValueChange={setEnterpriseType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select enterprise type" />
          </SelectTrigger>
          <SelectContent>
            {ENTERPRISE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="boardType">Board Type</Label>
        <Select value={boardType} onValueChange={setBoardType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select board type" />
          </SelectTrigger>
          <SelectContent>
            {BOARD_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ceoType">CEO Type</Label>
        <Select value={ceoType} onValueChange={setCeoType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select CEO type" />
          </SelectTrigger>
          <SelectContent>
            {CEO_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};