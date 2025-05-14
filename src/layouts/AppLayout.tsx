
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TopNavBar from "@/components/TopNavBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Set initial load to false after component mounts
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <SidebarProvider defaultCollapsed={isMobile && !initialLoad}>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavBar />
          <main className="flex-1 overflow-y-auto p-2 md:p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
