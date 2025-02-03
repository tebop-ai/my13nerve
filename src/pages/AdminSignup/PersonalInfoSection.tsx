import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { PersonalInfoSectionProps } from "./types";

export const PersonalInfoSection = ({ onNext }: PersonalInfoSectionProps) => {
  const { formState: { isValid }, watch } = useFormContext();
  const requiredFields = ['full_name', 'email', 'phone_number'];
  const values = watch(requiredFields);
  const isComplete = requiredFields.every(field => values[field]?.trim());

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-gray-500">
          Please provide your personal details for the admin application
        </p>
      </div>

      <FormField
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="+1 234 567 8900" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
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

      <div className="flex justify-end pt-6">
        <Button
          type="button"
          onClick={onNext}
          disabled={!isComplete}
          className="ml-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
};