import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { PersonalInfoSectionProps } from "./types";

export const PersonalInfoSection = ({ onNext }: PersonalInfoSectionProps) => {
  const { formState: { isValid } } = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
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

      <FormField
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

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onNext}
          className="ml-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
};