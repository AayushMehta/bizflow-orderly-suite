
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TopNavBar from "@/components/TopNavBar";
import MobileNavigation from "@/components/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        {!isMobile && <AppSidebar collapsed={isMobile && !initialLoad} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavBar />
          <main className={cn(
            "flex-1 overflow-y-auto p-3 md:p-4",
            isMobile ? "pb-20" : ""
          )}>
            <Outlet />
          </main>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
