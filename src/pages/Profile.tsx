
import { useState } from "react";
import { User, Lock, Mail, Building, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const Profile = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
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
    // Simulate API call
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
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
    
    // Simulate API call
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">My Profile</h1>
          <p className="text-app-slate-500">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-app-slate-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-app-slate-500" />
            </div>
            <h3 className="font-medium text-lg">{user?.name}</h3>
            <p className="text-app-slate-500 text-sm mt-1">{user?.email}</p>
            <div className="mt-3">
              {user?.role === "admin" && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">Administrator</Badge>
              )}
              {user?.role === "partner" && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">Partner</Badge>
              )}
              {user?.role === "data-entry" && (
                <Badge className="bg-green-100 text-green-700 border-green-200">Data Entry</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm">
              <div className="flex items-center mb-2">
                <Shield className="h-4 w-4 mr-2 text-app-slate-400" />
                <span className="text-app-slate-600">Role Permissions:</span>
              </div>
              {user?.role === "admin" && (
                <ul className="text-xs text-app-slate-500 space-y-1 ml-6">
                  <li>• Full access to all system features</li>
                  <li>• Can create and manage businesses</li>
                  <li>• Can manage user access and roles</li>
                  <li>• Unrestricted data modification rights</li>
                </ul>
              )}
              {user?.role === "partner" && (
                <ul className="text-xs text-app-slate-500 space-y-1 ml-6">
                  <li>• Can view all business data</li>
                  <li>• Can create and edit documents</li>
                  <li>• Cannot delete critical business data</li>
                  <li>• Cannot manage user access</li>
                </ul>
              )}
              {user?.role === "data-entry" && (
                <ul className="text-xs text-app-slate-500 space-y-1 ml-6">
                  <li>• Limited to assigned businesses only</li>
                  <li>• Can create and update basic records</li>
                  <li>• Cannot delete records</li>
                  <li>• Cannot access business settings</li>
                </ul>
              )}
            </div>
            <Button variant="outline" className="w-full" disabled>
              <Building className="mr-2 h-4 w-4" />
              {user?.role === "admin" ? "Managing All Businesses" : `Managing ${user?.businesses.length} Business(es)`}
            </Button>
          </CardFooter>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input 
                          id="name" 
                          className="pl-9" 
                          value={formData.name}
                          onChange={handleChange}
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
                          className="pl-9" 
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
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
                          className="pl-9" 
                          value={formData.currentPassword}
                          onChange={handleChange}
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
                          className="pl-9" 
                          value={formData.newPassword}
                          onChange={handleChange}
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
                          className="pl-9" 
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Update Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
