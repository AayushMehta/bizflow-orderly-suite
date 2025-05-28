
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  Users, 
  Home 
} from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/quotations", icon: FileText, label: "Quotes" },
    { path: "/invoices", icon: Receipt, label: "Invoices" },
    { path: "/clients", icon: Users, label: "Clients" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg min-w-0 flex-1",
                "touch-manipulation transition-colors duration-200",
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
