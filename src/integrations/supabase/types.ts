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
          personal_statement: string | null
          phone_number: string | null
          preferred_auth_method: string | null
          preferred_timezone: string | null
          professional_references: string | null
          purpose_statement: string | null
          review_notes: string | null
          reviewed_by: string | null
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
          personal_statement?: string | null
          phone_number?: string | null
          preferred_auth_method?: string | null
          preferred_timezone?: string | null
          professional_references?: string | null
          purpose_statement?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
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
          personal_statement?: string | null
          phone_number?: string | null
          preferred_auth_method?: string | null
          preferred_timezone?: string | null
          professional_references?: string | null
          purpose_statement?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
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
      enterprise_blueprints: {
        Row: {
          board_type: Database["public"]["Enums"]["board_type"]
          ceo_type: Database["public"]["Enums"]["ceo_type"]
          created_at: string | null
          created_by: string | null
          department_types: Database["public"]["Enums"]["department_type"][]
          enterprise_type: Database["public"]["Enums"]["enterprise_type"]
          executive_types: Database["public"]["Enums"]["executive_type"][]
          id: string
          is_active: boolean | null
          management_types: Database["public"]["Enums"]["management_type"][]
          name: string
        }
        Insert: {
          board_type: Database["public"]["Enums"]["board_type"]
          ceo_type: Database["public"]["Enums"]["ceo_type"]
          created_at?: string | null
          created_by?: string | null
          department_types: Database["public"]["Enums"]["department_type"][]
          enterprise_type: Database["public"]["Enums"]["enterprise_type"]
          executive_types: Database["public"]["Enums"]["executive_type"][]
          id?: string
          is_active?: boolean | null
          management_types: Database["public"]["Enums"]["management_type"][]
          name: string
        }
        Update: {
          board_type?: Database["public"]["Enums"]["board_type"]
          ceo_type?: Database["public"]["Enums"]["ceo_type"]
          created_at?: string | null
          created_by?: string | null
          department_types?: Database["public"]["Enums"]["department_type"][]
          enterprise_type?: Database["public"]["Enums"]["enterprise_type"]
          executive_types?: Database["public"]["Enums"]["executive_type"][]
          id?: string
          is_active?: boolean | null
          management_types?: Database["public"]["Enums"]["management_type"][]
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_secure_supercode: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      admin_application_status: "pending" | "approved" | "declined"
      board_type: "traditional" | "advisory" | "hybrid" | "supervisory"
      ceo_type: "founder" | "professional" | "interim" | "executive"
      department_type:
        | "engineering"
        | "finance"
        | "hr"
        | "marketing"
        | "operations"
        | "sales"
        | "legal"
        | "research"
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
