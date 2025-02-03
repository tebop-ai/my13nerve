import { supabase } from "@/integrations/supabase/client";

export const checkAdminProfile = async (email: string) => {
  console.log("Checking admin profile for:", email);
  const { data: adminProfile, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error("Error checking admin profile:", error);
    return null;
  }

  console.log("Admin profile found:", adminProfile);
  return adminProfile;
};

export const validateAdminAccess = (adminProfile: any) => {
  if (!adminProfile) return false;
  
  // Super admin check
  if (adminProfile.is_super_admin && adminProfile.email === 'goapele.main@superadmin.com') {
    return true;
  }
  
  // Regular admin check
  return adminProfile.status === 'active' && adminProfile.validation_status === 'validated';
};