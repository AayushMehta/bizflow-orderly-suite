
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  User,
  ChevronDown,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const TopNavBar = () => {
  const navigate = useNavigate();
  const [currentBusiness, setCurrentBusiness] = useState({ id: "NYC001", name: "New York Office" });
  
  // Mock user data
  const user = {
    name: "John Doe",
    role: "Administrator",
  };
  
  // Mock businesses data for the dropdown
  const businesses = [
    { id: "NYC001", name: "New York Office" },
    { id: "LA002", name: "Los Angeles Branch" },
    { id: "CHI003", name: "Chicago Division" },
  ];

  const handleBusinessChange = (business: { id: string; name: string }) => {
    setCurrentBusiness(business);
    // In a real app, you'd dispatch an action to change the context
  };

  return (
    <div className="h-16 px-4 border-b bg-white flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden mr-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Building className="h-4 w-4" />
              {currentBusiness.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            <DropdownMenuLabel>Switch Business</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => handleBusinessChange(business)}
                className={business.id === currentBusiness.id ? "bg-muted" : ""}
              >
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {business.id}
                  </Badge>
                  {business.name}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/select-business")}>
              Manage Businesses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <User className="h-5 w-5" />
              {user.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              {user.role}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavBar;
