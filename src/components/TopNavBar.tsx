
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  User,
  ChevronDown,
  Building,
  X
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
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";

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
  
  // Mock businesses data for the dropdown - in a real app this would come from an API or context
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
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Administrator</Badge>;
      case "partner":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Partner</Badge>;
      case "data-entry":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Data Entry</Badge>;
      default:
        return null;
    }
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
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Recent system notifications and updates
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between items-center my-2">
              <span className="text-sm">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px] mt-2">
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
            <Button variant="ghost" className="gap-2">
              <User className="h-5 w-5" />
              {user?.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
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
