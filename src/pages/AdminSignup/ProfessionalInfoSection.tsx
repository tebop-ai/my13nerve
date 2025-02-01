import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalInfoSectionProps } from "./types";

export const ProfessionalInfoSection = ({ form }: ProfessionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};