import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { PersonalInfoSectionProps } from "./types";

export const PersonalInfoSection = ({ onNext }: PersonalInfoSectionProps) => {
  const form = useFormContext();
  const { watch } = form;
  
  // Watch the required fields
  const fullName = watch('full_name');
  const email = watch('email');
  const phoneNumber = watch('phone_number');
  
  // Check if required fields are filled
  const isComplete = Boolean(
    fullName?.trim() && 
    email?.trim() && 
    phoneNumber?.trim()
  );

  console.log("Form values:", { fullName, email, phoneNumber, isComplete });

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
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="John Doe" 
                {...field} 
                required
                onChange={(e) => {
                  field.onChange(e);
                  console.log("Full name changed:", e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                {...field} 
                required
                onChange={(e) => {
                  field.onChange(e);
                  console.log("Email changed:", e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input 
                placeholder="+1 234 567 8900" 
                {...field} 
                required
                onChange={(e) => {
                  field.onChange(e);
                  console.log("Phone changed:", e.target.value);
                }}
              />
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
          onClick={() => {
            console.log("Next button clicked, form state:", { isComplete });
            onNext();
          }}
          disabled={!isComplete}
        >
          Next
        </Button>
      </div>
    </div>
  );
};