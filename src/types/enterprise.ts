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

export type BusinessFunctionType =
  | 'finance'
  | 'marketing'
  | 'procurement'
  | 'human_resources'
  | 'operations'
  | 'support';

export type DepartmentCategoryType =
  // Finance
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
  | 'it_finance'
  // Marketing
  | 'brand_management'
  | 'digital_marketing'
  | 'market_research'
  | 'advertising'
  | 'public_relations'
  | 'content_marketing'
  | 'social_media'
  | 'event_marketing'
  | 'product_marketing'
  | 'performance_marketing'
  | 'crm'
  | 'trade_marketing'
  // Procurement
  | 'vendor_management'
  | 'contract_negotiation'
  | 'cost_optimization'
  | 'category_management'
  | 'purchase_order_processing'
  | 'logistics_coordination'
  | 'procurement_compliance'
  | 'inventory_management'
  | 'strategic_procurement'
  // HR
  | 'talent_acquisition'
  | 'employee_relations'
  | 'learning_development'
  | 'compensation_benefits'
  | 'hr_compliance'
  | 'dei'
  | 'workforce_planning'
  | 'organizational_development'
  | 'hr_technology'
  | 'employee_wellbeing'
  // Operations
  | 'manufacturing'
  | 'supply_chain'
  | 'quality_control'
  | 'process_improvement'
  | 'facilities_management'
  | 'customer_support_ops'
  | 'business_continuity'
  | 'operational_excellence'
  | 'sustainability'
  | 'performance_monitoring';

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
  business_functions: BusinessFunctionType[];
  department_categories: DepartmentCategoryType[];
  is_active: boolean;
}