import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PersonalInfoSection } from "./AdminSignup/PersonalInfoSection";
import { ProfessionalInfoSection } from "./AdminSignup/ProfessionalInfoSection";
import { AgreementsSection } from "./AdminSignup/AgreementsSection";
import { adminSignupSchema, type AdminSignupFormData } from "./AdminSignup/types";

const AdminSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<AdminSignupFormData>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      background_check_consent: false,
      terms_accepted: false,
      code_of_conduct_accepted: false,
    },
  });

  const onSubmit = async (values: AdminSignupFormData) => {
    try {
      console.log("Starting form submission with values:", values);
      
      // Insert the form data into Supabase
      const { data, error } = await supabase
        .from("admin_profile_applications")
        .insert({
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number,
          current_job_title: values.current_job_title,
          work_experience: values.work_experience,
          industry_expertise: values.industry_expertise,
          linkedin_profile: values.linkedin_profile,
          purpose_statement: values.purpose_statement,
          ai_systems_experience: values.ai_systems_experience,
          certifications: values.certifications,
          background_check_consent: values.background_check_consent,
          terms_accepted: values.terms_accepted,
          code_of_conduct_accepted: values.code_of_conduct_accepted,
          personal_statement: values.personal_statement,
          languages_spoken: values.languages_spoken,
          preferred_timezone: values.preferred_timezone,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error("Error submitting application:", error);
        throw error;
      }

      console.log("Application submitted successfully:", data);

      toast({
        title: "Application Submitted Successfully",
        description: "Your application has been sent for review. We'll contact you soon.",
        duration: 5000,
      });
      
      // Navigate to home page after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Admin Profile Application</h1>
        <p className="text-muted-foreground">
          Complete this form to apply for an admin position
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection form={form} />
          <ProfessionalInfoSection form={form} />
          <AgreementsSection form={form} />
          
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSignup;