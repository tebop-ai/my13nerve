export type EnterpriseType = 'startup' | 'small_business' | 'medium_business' | 'corporation' | 'non_profit' | 'government';
export type BoardType = 'traditional' | 'advisory' | 'hybrid' | 'supervisory';
export type CEOType = 'founder' | 'professional' | 'interim' | 'executive';
export type ExecutiveType = 'cto' | 'cfo' | 'coo' | 'cmo' | 'chro' | 'cio';
export type ManagementType = 'project' | 'product' | 'operations' | 'hr' | 'finance' | 'marketing';
export type DepartmentType = 'engineering' | 'finance' | 'hr' | 'marketing' | 'operations' | 'sales' | 'legal' | 'research';

export interface EnterpriseBlueprint {
  id: string;
  created_at: string;
  created_by: string;
  name: string;
  enterprise_type: EnterpriseType;
  board_type: BoardType;
  ceo_type: CEOType;
  executive_types: ExecutiveType[];
  management_types: ManagementType[];
  department_types: DepartmentType[];
  is_active: boolean;
}