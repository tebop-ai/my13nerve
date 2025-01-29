import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EnterpriseType, BoardType, CEOType } from "@/types/enterprise";

interface BlueprintBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  enterpriseType: EnterpriseType | "";
  setEnterpriseType: (value: EnterpriseType) => void;
  boardType: BoardType | "";
  setBoardType: (value: BoardType) => void;
  ceoType: CEOType | "";
  setCeoType: (value: CEOType) => void;
}

const ENTERPRISE_TYPES = ['startup', 'small_business', 'medium_business', 'corporation', 'non_profit', 'government'] as const;
const BOARD_TYPES = ['traditional', 'advisory', 'hybrid', 'supervisory'] as const;
const CEO_TYPES = ['founder', 'professional', 'interim', 'executive'] as const;

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
        <Select 
          value={enterpriseType} 
          onValueChange={(value) => setEnterpriseType(value as EnterpriseType)}
          required
        >
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
        <Select 
          value={boardType} 
          onValueChange={(value) => setBoardType(value as BoardType)}
          required
        >
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
        <Select 
          value={ceoType} 
          onValueChange={(value) => setCeoType(value as CEOType)}
          required
        >
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