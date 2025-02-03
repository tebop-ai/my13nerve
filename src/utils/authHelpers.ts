import { supabase } from "@/integrations/supabase/client";

export const handleAdminLogin = async (email: string, password: string) => {
  console.log("Attempting admin login for:", email);
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    const { data: adminProfile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) throw profileError;

    if (!adminProfile) {
      throw new Error("Admin profile not found");
    }

    console.log("Admin login successful:", {
      isSuperAdmin: adminProfile.is_super_admin,
      status: adminProfile.status,
      validationStatus: adminProfile.validation_status
    });

    // Store admin profile in session storage
    sessionStorage.setItem("adminProfile", JSON.stringify(adminProfile));
    sessionStorage.setItem("isAdminAuthenticated", "true");

    return {
      success: true,
      adminProfile
    };

  } catch (error) {
    console.error("Admin login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed"
    };
  }
};

export const handleAdminLogout = async () => {
  try {
    await supabase.auth.signOut();
    sessionStorage.removeItem("adminProfile");
    sessionStorage.removeItem("isAdminAuthenticated");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed"
    };
  }
};