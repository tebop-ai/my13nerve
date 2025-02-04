export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Accounting: {
        Row: {
          Code: string | null
          "Full Description": string | null
          Occurrence: string | null
          "Sub-Task": string | null
          Tools: string | null
        }
        Insert: {
          Code?: string | null
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Update: {
          Code?: string | null
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Relationships: []
      }
      admin_profile_applications: {
        Row: {
          ai_systems_experience: string | null
          background_check_consent: boolean | null
          certifications: string | null
          code_of_conduct_accepted: boolean | null
          created_at: string | null
          current_job_title: string | null
          email: string
          endorsements: string | null
          full_name: string
          generated_supercode: string | null
          government_id_url: string | null
          id: string
          industry_expertise: string | null
          languages_spoken: string | null
          linkedin_profile: string | null
          nda_document_url: string | null
          pdf_downloaded_at: string | null
          personal_statement: string | null
          phone_number: string | null
          preferred_auth_method: string | null
          preferred_timezone: string | null
          professional_references: string | null
          purpose_statement: string | null
          review_notes: string | null
          reviewed_by: string | null
          role: string | null
          role_function: string | null
          status: Database["public"]["Enums"]["admin_application_status"] | null
          terms_accepted: boolean | null
          updated_at: string | null
          work_experience: string | null
        }
        Insert: {
          ai_systems_experience?: string | null
          background_check_consent?: boolean | null
          certifications?: string | null
          code_of_conduct_accepted?: boolean | null
          created_at?: string | null
          current_job_title?: string | null
          email: string
          endorsements?: string | null
          full_name: string
          generated_supercode?: string | null
          government_id_url?: string | null
          id?: string
          industry_expertise?: string | null
          languages_spoken?: string | null
          linkedin_profile?: string | null
          nda_document_url?: string | null
          pdf_downloaded_at?: string | null
          personal_statement?: string | null
          phone_number?: string | null
          preferred_auth_method?: string | null
          preferred_timezone?: string | null
          professional_references?: string | null
          purpose_statement?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          role?: string | null
          role_function?: string | null
          status?:
            | Database["public"]["Enums"]["admin_application_status"]
            | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          work_experience?: string | null
        }
        Update: {
          ai_systems_experience?: string | null
          background_check_consent?: boolean | null
          certifications?: string | null
          code_of_conduct_accepted?: boolean | null
          created_at?: string | null
          current_job_title?: string | null
          email?: string
          endorsements?: string | null
          full_name?: string
          generated_supercode?: string | null
          government_id_url?: string | null
          id?: string
          industry_expertise?: string | null
          languages_spoken?: string | null
          linkedin_profile?: string | null
          nda_document_url?: string | null
          pdf_downloaded_at?: string | null
          personal_statement?: string | null
          phone_number?: string | null
          preferred_auth_method?: string | null
          preferred_timezone?: string | null
          professional_references?: string | null
          purpose_statement?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          role?: string | null
          role_function?: string | null
          status?:
            | Database["public"]["Enums"]["admin_application_status"]
            | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          work_experience?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          application_id: string | null
          created_at: string | null
          email: string
          enterprise_limit: number | null
          full_name: string
          id: string
          is_super_admin: boolean | null
          last_login: string | null
          role: string | null
          status: string | null
          supercode: string
          validated_by: string | null
          validation_date: string | null
          validation_status: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          email: string
          enterprise_limit?: number | null
          full_name: string
          id: string
          is_super_admin?: boolean | null
          last_login?: string | null
          role?: string | null
          status?: string | null
          supercode: string
          validated_by?: string | null
          validation_date?: string | null
          validation_status?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          email?: string
          enterprise_limit?: number | null
          full_name?: string
          id?: string
          is_super_admin?: boolean | null
          last_login?: string | null
          role?: string | null
          status?: string | null
          supercode?: string
          validated_by?: string | null
          validation_date?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "admin_profile_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry_type: string
          is_active: boolean | null
          last_updated: string | null
          name: string
          specifications: Json | null
          task_capacities: Json | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_type: string
          is_active?: boolean | null
          last_updated?: string | null
          name: string
          specifications?: Json | null
          task_capacities?: Json | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_type?: string
          is_active?: boolean | null
          last_updated?: string | null
          name?: string
          specifications?: Json | null
          task_capacities?: Json | null
          version?: string | null
        }
        Relationships: []
      }
      "Customer Insights": {
        Row: {
          Code: string
          "Full Description": string | null
          Occurrence: string | null
          "Sub-Task": string | null
          Tools: string | null
        }
        Insert: {
          Code: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Update: {
          Code?: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Relationships: []
      }
      enterprise_blueprints: {
        Row: {
          accounting_tasks: string[] | null
          blueprint_type: string | null
          board_type: Database["public"]["Enums"]["board_type"]
          business_functions:
            | Database["public"]["Enums"]["business_function_type"][]
            | null
          ceo_type: Database["public"]["Enums"]["ceo_type"]
          created_at: string | null
          created_by: string | null
          csv_tasks: Json | null
          department_categories:
            | Database["public"]["Enums"]["department_category_type"][]
            | null
          department_types: Database["public"]["Enums"]["department_type"][]
          enterprise_type: Database["public"]["Enums"]["enterprise_type"]
          executive_types: Database["public"]["Enums"]["executive_type"][]
          id: string
          is_active: boolean | null
          management_types: Database["public"]["Enums"]["management_type"][]
          name: string
          super_admin_created: boolean | null
        }
        Insert: {
          accounting_tasks?: string[] | null
          blueprint_type?: string | null
          board_type: Database["public"]["Enums"]["board_type"]
          business_functions?:
            | Database["public"]["Enums"]["business_function_type"][]
            | null
          ceo_type: Database["public"]["Enums"]["ceo_type"]
          created_at?: string | null
          created_by?: string | null
          csv_tasks?: Json | null
          department_categories?:
            | Database["public"]["Enums"]["department_category_type"][]
            | null
          department_types?: Database["public"]["Enums"]["department_type"][]
          enterprise_type: Database["public"]["Enums"]["enterprise_type"]
          executive_types: Database["public"]["Enums"]["executive_type"][]
          id?: string
          is_active?: boolean | null
          management_types: Database["public"]["Enums"]["management_type"][]
          name: string
          super_admin_created?: boolean | null
        }
        Update: {
          accounting_tasks?: string[] | null
          blueprint_type?: string | null
          board_type?: Database["public"]["Enums"]["board_type"]
          business_functions?:
            | Database["public"]["Enums"]["business_function_type"][]
            | null
          ceo_type?: Database["public"]["Enums"]["ceo_type"]
          created_at?: string | null
          created_by?: string | null
          csv_tasks?: Json | null
          department_categories?:
            | Database["public"]["Enums"]["department_category_type"][]
            | null
          department_types?: Database["public"]["Enums"]["department_type"][]
          enterprise_type?: Database["public"]["Enums"]["enterprise_type"]
          executive_types?: Database["public"]["Enums"]["executive_type"][]
          id?: string
          is_active?: boolean | null
          management_types?: Database["public"]["Enums"]["management_type"][]
          name?: string
          super_admin_created?: boolean | null
        }
        Relationships: []
      }
      "Marketing Comm": {
        Row: {
          Code: string
          "Full Description": string | null
          Occurrence: string | null
          "Sub-Task": string | null
          Tools: string | null
        }
        Insert: {
          Code: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Update: {
          Code?: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Relationships: []
      }
      Product_Service: {
        Row: {
          Code: string
          "Full Description": string | null
          Occurrence: string | null
          "Sub-Task": string | null
          Tools: string | null
        }
        Insert: {
          Code: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Update: {
          Code?: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Relationships: []
      }
      "R&D_Ops": {
        Row: {
          Code: string
          "Full Description": string | null
          Occurrence: string | null
          "Sub-Task": string | null
          Tools: string | null
        }
        Insert: {
          Code: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Update: {
          Code?: string
          "Full Description"?: string | null
          Occurrence?: string | null
          "Sub-Task"?: string | null
          Tools?: string | null
        }
        Relationships: []
      }
      timeline_views: {
        Row: {
          created_at: string | null
          enterprise_id: string
          id: string
          timeframe: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enterprise_id: string
          id?: string
          timeframe?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enterprise_id?: string
          id?: string
          timeframe?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_views_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          admin_creator_id: string | null
          created_at: string | null
          created_by: string | null
          email: string
          enterprise_id: string | null
          enterprise_role: string | null
          full_name: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          profile_type: Database["public"]["Enums"]["user_profile_type"] | null
        }
        Insert: {
          admin_creator_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email: string
          enterprise_id?: string | null
          enterprise_role?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
        }
        Update: {
          admin_creator_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          enterprise_id?: string | null
          enterprise_role?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_admin_creator_id_fkey"
            columns: ["admin_creator_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprise_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_enterprise_limit: {
        Args: {
          admin_id: string
        }
        Returns: boolean
      }
      generate_secure_supercode: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_available_tasks: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          task_code: string
          task_description: string
          occurrence: string
          sub_task: string
          tools: string
        }[]
      }
      validate_admin_profile: {
        Args: {
          profile_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      admin_application_status: "pending" | "approved" | "declined"
      board_type: "traditional" | "advisory" | "hybrid" | "supervisory"
      business_function_type:
        | "finance"
        | "marketing"
        | "procurement"
        | "human_resources"
        | "operations"
        | "support"
      ceo_type: "founder" | "professional" | "interim" | "executive"
      department_category_type:
        | "accounting"
        | "financial_planning"
        | "treasury"
        | "risk_management"
        | "internal_audit"
        | "tax"
        | "investor_relations"
        | "compliance"
        | "procurement"
        | "strategic_finance"
        | "it_finance"
        | "brand_management"
        | "digital_marketing"
        | "market_research"
        | "advertising"
        | "public_relations"
        | "content_marketing"
        | "social_media"
        | "event_marketing"
        | "product_marketing"
        | "performance_marketing"
        | "crm"
        | "trade_marketing"
        | "vendor_management"
        | "contract_negotiation"
        | "cost_optimization"
        | "category_management"
        | "purchase_order_processing"
        | "logistics_coordination"
        | "procurement_compliance"
        | "inventory_management"
        | "strategic_procurement"
        | "talent_acquisition"
        | "employee_relations"
        | "learning_development"
        | "compensation_benefits"
        | "hr_compliance"
        | "dei"
        | "workforce_planning"
        | "organizational_development"
        | "hr_technology"
        | "employee_wellbeing"
        | "manufacturing"
        | "supply_chain"
        | "quality_control"
        | "process_improvement"
        | "facilities_management"
        | "customer_support_ops"
        | "business_continuity"
        | "operational_excellence"
        | "sustainability"
        | "performance_monitoring"
      department_type:
        | "accounting"
        | "financial_planning"
        | "treasury"
        | "risk_management"
        | "internal_audit"
        | "tax"
        | "investor_relations"
        | "compliance"
        | "procurement"
        | "strategic_finance"
        | "it_finance"
      enterprise_type:
        | "startup"
        | "small_business"
        | "medium_business"
        | "corporation"
        | "non_profit"
        | "government"
      executive_type: "cto" | "cfo" | "coo" | "cmo" | "chro" | "cio"
      management_type:
        | "project"
        | "product"
        | "operations"
        | "hr"
        | "finance"
        | "marketing"
      user_profile_type: "enterprise_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
