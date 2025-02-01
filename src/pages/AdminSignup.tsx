import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PersonalInfoSection } from "./AdminSignup/PersonalInfoSection";
import { ProfessionalInfoSection } from "./AdminSignup/ProfessionalInfoSection";
import { AgreementsSection } from "./AdminSignup/AgreementsSection";
import { AdminApplicationFormData } from "./AdminSignup/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdminApplicationFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    governmentIdUrl: "",
    currentJobTitle: "",
    workExperience: "",
    industryExpertise: "",
    linkedinProfile: "",
    purposeStatement: "",
    roleFunction: "",
    certifications: "",
    aiSystemsExperience: "",
    backgroundCheckConsent: false,
    ndaDocumentUrl: "",
    preferredAuthMethod: "",
    professionalReferences: "",
    endorsements: "",
    termsAccepted: false,
    codeOfConductAccepted: false,
    personalStatement: "",
    languagesSpoken: "",
    preferredTimezone: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      console.log("Submitting admin application:", formData);
      
      const { data, error } = await supabase
        .from('admin_profile_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            government_id_url: formData.governmentIdUrl,
            current_job_title: formData.currentJobTitle,
            work_experience: formData.workExperience,
            industry_expertise: formData.industryExpertise,
            linkedin_profile: formData.linkedinProfile,
            purpose_statement: formData.purposeStatement,
            role_function: formData.roleFunction,
            certifications: formData.certifications,
            ai_systems_experience: formData.aiSystemsExperience,
            background_check_consent: formData.backgroundCheckConsent,
            nda_document_url: formData.ndaDocumentUrl,
            preferred_auth_method: formData.preferredAuthMethod,
            professional_references: formData.professionalReferences,
            endorsements: formData.endorsements,
            terms_accepted: formData.termsAccepted,
            code_of_conduct_accepted: formData.codeOfConductAccepted,
            personal_statement: formData.personalStatement,
            languages_spoken: formData.languagesSpoken,
            preferred_timezone: formData.preferredTimezone,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      console.log("Admin application submitted successfully:", data);
      
      toast({
        title: "Application Submitted",
        description: "Your admin application has been submitted successfully. We'll review it shortly.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting admin application:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (data: Partial<AdminApplicationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Application</h1>
          <p className="mt-2 text-gray-600">Join our team of administrators</p>
        </div>

        <Card className="p-6">
          {currentStep === 1 && (
            <PersonalInfoSection
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <ProfessionalInfoSection
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <AgreementsSection
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;