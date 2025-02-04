import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Settings, LogOut, Bot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Logo";

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const { data: adminProfile, isLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return null;

      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching admin profile:", error);
        return null;
      }
      return profile;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("adminProfile");
    sessionStorage.removeItem("isAdminAuthenticated");
    navigate('/');
  };

  if (isLoading) {
    return <div className="animate-pulse bg-sidebar w-16 h-screen" />;
  }

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-text border-r border-sidebar-border h-screen relative group/sidebar",
        state === "collapsed" ? "w-16" : "w-60"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-24 flex items-center justify-center border-b border-sidebar-border">
          <Logo className={cn(
            "transition-all duration-300",
            state === "collapsed" ? "h-12" : "h-16"
          )} />
        </div>

        <div className="flex-1 py-4 space-y-2 px-2">
          {adminProfile?.is_super_admin ? (
            // Super Admin Menu Items
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/dashboard')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                {state !== "collapsed" && "Dashboard"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/ai-agents')}
              >
                <Bot className="h-5 w-5 mr-2" />
                {state !== "collapsed" && "AI Agents"}
              </Button>
            </>
          ) : (
            // Regular Admin Menu Items
            <>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/admin-dashboard')}
              >
                <Building2 className="h-5 w-5 mr-2" />
                {state !== "collapsed" && "Enterprises"}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                onClick={() => navigate('/users')}
              >
                <Users className="h-5 w-5 mr-2" />
                {state !== "collapsed" && "Users"}
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5 mr-2" />
            {state !== "collapsed" && "Settings"}
          </Button>
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-text hover:text-white hover:bg-sidebar-hover"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {state !== "collapsed" && "Logout"}
          </Button>
        </div>
      </div>
    </aside>
  );
}