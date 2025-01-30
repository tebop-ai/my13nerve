export type EnterpriseType = 'startup' | 'small_business' | 'medium_business' | 'corporation' | 'non_profit' | 'government';
export type BoardType = 'traditional' | 'advisory' | 'hybrid' | 'supervisory';
export type CEOType = 'founder' | 'professional' | 'interim' | 'executive';
export type ExecutiveType = 'cto' | 'cfo' | 'coo' | 'cmo' | 'chro' | 'cio';
export type ManagementType = 'project' | 'product' | 'operations' | 'hr' | 'finance' | 'marketing';
export type DepartmentType = 
  | 'accounting'
  | 'financial_planning'
  | 'treasury'
  | 'risk_management'
  | 'internal_audit'
  | 'tax'
  | 'investor_relations'
  | 'compliance'
  | 'procurement'
  | 'strategic_finance'
  | 'it_finance';

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