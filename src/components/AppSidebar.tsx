import { 
  BarChart3, 
  Users, 
  Settings, 
  Globe,
  Home,
  ChevronDown,
  Layout,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainMenuItems = [
  { title: "Overview", icon: Home, url: "/dashboard" },
  { title: "Admin Profiles", icon: Users, url: "/dashboard?tab=admin-profiles" },
  { title: "Analytics", icon: BarChart3, url: "/dashboard?tab=overview" },
];

const subMenuItems = {
  applications: [
    { title: "Create Blueprint", url: "/dashboard?tab=blueprints" },
    { title: "View Blueprints", url: "/dashboard?tab=blueprints" },
  ],
  enterprises: [
    { title: "All Enterprises", url: "/dashboard?tab=overview" },
    { title: "Settings", url: "/dashboard?tab=settings" },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    applications: false,
    enterprises: false,
  });
  
  if (location.pathname === "/") {
    return null;
  }

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-secondary">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white">my13nerve</h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-white hover:bg-sidebar-hover"
                  >
                    <Link 
                      to={item.url}
                      className="flex items-center gap-2 px-4 py-2 rounded-md"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible
                open={openSections.applications}
                onOpenChange={() => toggleSection('applications')}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-sidebar-hover rounded-md">
                  <Layout className="h-5 w-5" />
                  <span className="flex-1 text-left">Applications</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    openSections.applications ? "transform rotate-180" : ""
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                  {subMenuItems.applications.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-sidebar-hover rounded-md"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={openSections.enterprises}
                onOpenChange={() => toggleSection('enterprises')}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-sidebar-hover rounded-md">
                  <Globe className="h-5 w-5" />
                  <span className="flex-1 text-left">Enterprises</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    openSections.enterprises ? "transform rotate-180" : ""
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                  {subMenuItems.enterprises.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-sidebar-hover rounded-md"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-white hover:bg-sidebar-hover"
                >
                  <Link 
                    to="/dashboard?tab=settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-md"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}