export interface AdminSignupFormData {
  full_name: string;
  email: string;
  phone_number?: string;
  current_job_title: string;
  work_experience: string;
  industry_expertise: string;
  linkedin_profile: string;
  purpose_statement: string;
  ai_systems_experience: string;
  certifications?: string;
  background_check_consent: boolean;
  terms_accepted: boolean;
  code_of_conduct_accepted: boolean;
  personal_statement: string;
  languages_spoken: string;
  preferred_timezone: string;
  professional_references?: string;
  endorsements?: string;
}

export interface PersonalInfoSectionProps {
  onNext: () => void;
}

export interface ProfessionalInfoSectionProps {
  onNext: () => void;
  onBack: () => void;
}

export interface AgreementsSectionProps {
  onBack: () => void;
}