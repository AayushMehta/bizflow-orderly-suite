
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  User,
  ChevronDown,
  Building,
  X,
  Menu,
  MoreHorizontal
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
};

const TopNavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const isMobile = useIsMobile();
  
  const [currentBusiness, setCurrentBusiness] = useState(() => {
    const stored = localStorage.getItem("selectedBusiness");
    return stored ? JSON.parse(stored) : { id: "", name: "No Business Selected" };
  });
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      title: "New quotation approved",
      description: "Quotation QT-2025-045 has been approved by the client.",
      time: "10 minutes ago",
      read: false,
      type: 'success'
    },
    {
      id: "n2",
      title: "Invoice due soon",
      description: "Invoice INV-2025-032 is due in 3 days.",
      time: "2 hours ago",
      read: false,
      type: 'warning'
    },
    {
      id: "n3",
      title: "Purchase order ready for delivery",
      description: "PO002 has been moved to 'Ready for Delivery' status.",
      time: "1 day ago",
      read: false,
      type: 'info'
    }
  ]);
  
  // Mock businesses data for the dropdown
  const [businesses, setBusinesses] = useState(() => {
    if (user?.role === "admin") {
      return [
        { id: "NYC001", name: "New York Office" },
        { id: "LA002", name: "Los Angeles Branch" },
        { id: "CHI003", name: "Chicago Division" },
      ];
    } else if (user?.role === "partner") {
      return [
        { id: "NYC001", name: "New York Office" },
        { id: "LA002", name: "Los Angeles Branch" },
      ];
    } else {
      return [
        { id: "NYC001", name: "New York Office" },
      ];
    }
  });

  const handleBusinessChange = (business: { id: string; name: string }) => {
    setCurrentBusiness(business);
    localStorage.setItem("selectedBusiness", JSON.stringify(business));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadge = () => {
    switch (user?.role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
      case "partner":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Partner</Badge>;
      case "data-entry":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Data Entry</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-14 border-b bg-white flex items-center justify-between shadow-sm px-3 sticky top-0 z-40">
      <div className="flex items-center">
        {!isMobile && (
          <SidebarTrigger className="sidebar-trigger mr-2">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 text-xs h-8">
              <Building className="h-3 w-3" />
              <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentBusiness.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px] z-50">
            <DropdownMenuLabel>Switch Business</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => handleBusinessChange(business)}
                className={business.id === currentBusiness.id ? "bg-muted" : ""}
              >
                <span className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {business.id}
                  </Badge>
                  <span className="truncate">{business.name}</span>
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
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <Button 
            variant="ghost" 
            size="sm"
            className="relative h-8 w-8 p-0"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden z-50">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Recent system notifications
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between items-center my-2">
              <span className="text-sm">{unreadCount} unread</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[50vh] mt-2">
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.read && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 h-8">
              {isMobile ? (
                <MoreHorizontal className="h-4 w-4" />
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-[80px]">{user?.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] z-50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between items-center pointer-events-none">
              <span className="text-muted-foreground">Role:</span>
              {getRoleBadge()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavBar;
