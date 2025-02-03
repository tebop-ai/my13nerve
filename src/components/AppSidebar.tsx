import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Settings, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Logo";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();
      
      if (error) {
        console.error("Error fetching admin profile:", error);
        return null;
      }
      return profile;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-text border-r border-sidebar-border h-screen relative group/sidebar",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          <Logo className={cn(
            "transition-all duration-300",
            collapsed ? "h-8" : "h-10"
          )} />
        </div>

        <div className="flex-1 py-4 space-y-2 px-2">
          {adminProfile?.is_super_admin ? (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/dashboard')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                {!collapsed && "Dashboard"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/admin-profiles')}
              >
                <Users className="h-5 w-5 mr-2" />
                {!collapsed && "Admin Profiles"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                {!collapsed && "Enterprises"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/users')}
              >
                <Users className="h-5 w-5 mr-2" />
                {!collapsed && "Users"}
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5 mr-2" />
            {!collapsed && "Settings"}
          </Button>
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </aside>
  );
}