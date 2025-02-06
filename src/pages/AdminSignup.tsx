import { Card } from "@/components/ui/card";
import { PersonalInfoSection } from "./AdminSignup/PersonalInfoSection";
import { ProfessionalInfoSection } from "./AdminSignup/ProfessionalInfoSection";
import { AgreementsSection } from "./AdminSignup/AgreementsSection";
import { AdminSignupFormData } from "./AdminSignup/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const methods = useForm<AdminSignupFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      current_job_title: "",
      work_experience: "",
      industry_expertise: "",
      linkedin_profile: "",
      purpose_statement: "",
      ai_systems_experience: "",
      certifications: "",
      background_check_consent: false,
      terms_accepted: false,
      code_of_conduct_accepted: false,
      personal_statement: "",
      languages_spoken: "",
      preferred_timezone: "",
      professional_references: "",
      endorsements: "",
    }
  });

  const handleSubmit = async (data: AdminSignupFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting admin application:", data);
      
      const { data: response, error } = await supabase
        .from('admin_profile_applications')
        .insert([
          {
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            current_job_title: data.current_job_title,
            work_experience: data.work_experience,
            industry_expertise: data.industry_expertise,
            linkedin_profile: data.linkedin_profile,
            purpose_statement: data.purpose_statement,
            ai_systems_experience: data.ai_systems_experience,
            certifications: data.certifications,
            background_check_consent: data.background_check_consent,
            professional_references: data.professional_references,
            endorsements: data.endorsements,
            terms_accepted: data.terms_accepted,
            code_of_conduct_accepted: data.code_of_conduct_accepted,
            personal_statement: data.personal_statement,
            languages_spoken: data.languages_spoken,
            preferred_timezone: data.preferred_timezone,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error("Error submitting admin application:", error);
        throw error;
      }

      console.log("Admin application submitted successfully:", response);
      
      toast({
        title: "Application Submitted Successfully",
        description: "Your application has been received. You will receive further instructions via email.",
        duration: 5000,
      });
      
      // Short delay before redirecting to allow user to see the success message
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error: any) {
      console.error("Error submitting admin application:", error);
      toast({
        title: "Submission Error",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="mt-2 text-gray-600">
            Join our platform as an Admin to manage enterprises and their users
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Your application will be reviewed by our Super Admin
          </p>
        </div>

        <Card className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              {currentStep === 1 && (
                <PersonalInfoSection
                  onNext={handleNext}
                />
              )}
              
              {currentStep === 2 && (
                <ProfessionalInfoSection
                  form={methods}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              
              {currentStep === 3 && (
                <AgreementsSection
                  form={methods}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignup;