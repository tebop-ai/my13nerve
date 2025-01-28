import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  current_job_title: z.string().min(2, "Job title is required"),
  work_experience: z.string().min(50, "Please provide detailed work experience"),
  industry_expertise: z.string().min(20, "Please specify your industry expertise"),
  linkedin_profile: z.string().url("Please provide a valid LinkedIn URL"),
  purpose_statement: z.string().min(100, "Please provide a detailed purpose statement"),
  ai_systems_experience: z.string().min(50, "Please describe your AI systems experience"),
  background_check_consent: z.boolean(),
  terms_accepted: z.boolean(),
  code_of_conduct_accepted: z.boolean(),
  personal_statement: z.string().min(100, "Please provide a detailed personal statement"),
  languages_spoken: z.string(),
  preferred_timezone: z.string(),
});

const AdminSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      background_check_consent: false,
      terms_accepted: false,
      code_of_conduct_accepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from("admin_profile_applications")
        .insert(values); // Changed from [values] to values

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="work_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your relevant work experience..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry_expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Expertise</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your areas of industry expertise..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose_statement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose Statement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Why do you want to become an admin?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ai_systems_experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Systems Experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your experience with AI systems..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="languages_spoken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages Spoken</FormLabel>
                  <FormControl>
                    <Input placeholder="English, Spanish, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="UTC+1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="personal_statement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Statement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="background_check_consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to a background check
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms_accepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the terms and conditions
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code_of_conduct_accepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the code of conduct
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSignup;