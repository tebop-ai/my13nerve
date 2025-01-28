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
      const { error } = await supabase
        .from("admin_profile_applications")
        .insert(values);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your admin profile application has been submitted for review.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
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