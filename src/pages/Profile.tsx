
import { useState } from "react";
import { 
  User, 
  Lock, 
  Mail, 
  Building, 
  Shield, 
  Camera, 
  Edit2, 
  Save, 
  X,
  Phone,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "New password and confirm password don't match.",
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

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

  const getPermissionsList = () => {
    switch (user?.role) {
      case "admin":
        return [
          "Full access to all system features",
          "Can create and manage businesses",
          "Can manage user access and roles",
          "Unrestricted data modification rights",
          "Access to system analytics and reports"
        ];
      case "partner":
        return [
          "Can view all business data",
          "Can create and edit documents",
          "Cannot delete critical business data",
          "Cannot manage user access",
          "Limited to assigned businesses"
        ];
      case "data-entry":
        return [
          "Limited to assigned businesses only",
          "Can create and update basic records",
          "Cannot delete records",
          "Cannot access business settings",
          "Read-only access to reports"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">My Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block max-w-4xl mx-auto pt-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 mt-1">{user?.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  {getRoleBadge()}
                  <Badge variant="outline" className="text-xs">
                    Active Since {formData.joinDate}
                  </Badge>
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {user?.role === "admin" ? "All" : user?.businesses?.length || 1}
              </div>
              <div className="text-sm text-gray-500">Businesses</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-500">Documents</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-500">Completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          id="name" 
                          className="pl-10 h-12" 
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          className="pl-10 h-12" 
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          id="phone" 
                          className="pl-10 h-12" 
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          id="location" 
                          className="pl-10 h-12" 
                          value={formData.location}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 h-12">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 h-12"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password for better security</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        className="pl-10 h-12" 
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input 
                        id="newPassword" 
                        type="password" 
                        className="pl-10 h-12" 
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        className="pl-10 h-12" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 mt-6">
                    Update Password
                  </Button>
                </CardContent>
              </form>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Add an extra layer of security</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Login Notifications</div>
                    <div className="text-sm text-gray-500">Get notified of new sign-ins</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Permissions
                </CardTitle>
                <CardDescription>Your current role and access permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Current Role</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getRoleBadge()}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Permissions & Access</h4>
                  <div className="space-y-2">
                    {getPermissionsList().map((permission, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Business Access</h4>
                  <div className="space-y-2">
                    {user?.role === "admin" ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium">All Businesses</div>
                            <div className="text-sm text-gray-500">Full administrative access</div>
                          </div>
                        </div>
                        <Badge variant="outline">Admin Access</Badge>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">New York Office</div>
                              <div className="text-sm text-gray-500">NYC001</div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        {user?.role === "partner" && (
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Building className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="font-medium">Los Angeles Branch</div>
                                <div className="text-sm text-gray-500">LA002</div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
