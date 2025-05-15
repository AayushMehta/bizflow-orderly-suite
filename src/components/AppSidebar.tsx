import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  FileText,
  ShoppingCart,
  Receipt,
  Users,
  Settings,
  LogOut,
  Building,
  Package,
  UserPlus,
  FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  collapsed?: boolean;
}

const AppSidebar = ({ collapsed }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useUser();
  const isMobile = useIsMobile();
  
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // On mobile, auto-collapse sidebar after navigation
    if (isMobile) {
      const sidebarTrigger = document.querySelector('.sidebar-trigger') as HTMLButtonElement;
      if (sidebarTrigger) {
        setTimeout(() => {
          sidebarTrigger.click();
        }, 150);
      }
    }
  };

  return (
    <Sidebar className="z-40" defaultCollapsed={collapsed}>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-bold text-white">BizFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActivePath("/dashboard") ? "bg-sidebar-accent" : ""}>
                  <button onClick={() => handleNavigation("/dashboard")}>
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {hasPermission("view", "quotation") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/quotations") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/quotations")}>
                      <FileText className="h-5 w-5" />
                      <span>Quotations</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission("view", "purchase-order") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/purchase-orders") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/purchase-orders")}>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Purchase Orders</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission("view", "invoice") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/invoices") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/invoices")}>
                      <Receipt className="h-5 w-5" />
                      <span>Invoices</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission("view", "client") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/clients") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/clients")}>
                      <Users className="h-5 w-5" />
                      <span>Clients</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission("view", "product") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/products") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/products")}>
                      <Package className="h-5 w-5" />
                      <span>Product Catalog</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {hasPermission("view", "user") && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/teams") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/teams")}>
                      <UserPlus className="h-5 w-5" />
                      <span>Team Management</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {hasPermission("view", "business") && (
          <SidebarGroup>
            <SidebarGroupLabel>Business</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hasPermission("create", "business") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActivePath("/business-onboarding") ? "bg-sidebar-accent" : ""}>
                      <button onClick={() => handleNavigation("/business-onboarding")}>
                        <FolderPlus className="h-5 w-5" />
                        <span>Business Onboarding</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActivePath("/settings") ? "bg-sidebar-accent" : ""}>
                    <button onClick={() => handleNavigation("/settings")}>
                      <Settings className="h-5 w-5" />
                      <span>Business Settings</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
        <SidebarTrigger className="sidebar-trigger w-full mt-4 hidden md:flex" />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
