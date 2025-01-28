import * as z from "zod";

export const adminSignupSchema = z.object({
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

export type AdminSignupFormData = z.infer<typeof adminSignupSchema>;