
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Settings, 
  Building, 
  FileText, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Save,
  Users,
  CreditCard,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const BusinessSettings = () => {
  const { toast } = useToast();
  const [businessData, setBusinessData] = useState({
    name: "New York Office",
    description: "Manufacturing and headquarters",
    businessId: "NYC001",
    taxId: "TAX-12345678",
    address: "123 Broadway, New York, NY 10001",
    email: "nyc.office@example.com",
    phone: "+1 (212) 555-7890",
    website: "https://example.com/nyc",
    logo: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would save changes to the backend here
    console.log("Saving business settings:", businessData);
    
    toast({
      title: "Settings saved",
      description: "Your business settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Business Settings</h1>
          <p className="text-app-slate-500">Configure your business profile and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/select-business">Switch Business</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 bg-background border-b w-full justify-start rounded-none pb-0 h-auto">
          <TabsTrigger value="general" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-app-blue-600 data-[state=active]:shadow-none">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-app-blue-600 data-[state=active]:shadow-none">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing & Taxes
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-app-blue-600 data-[state=active]:shadow-none">
            <Users className="mr-2 h-4 w-4" />
            Team Access
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-app-blue-600 data-[state=active]:shadow-none">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      name="name"
                      value={businessData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessId">Business ID</Label>
                  <Input 
                    id="businessId"
                    name="businessId"
                    value={businessData.businessId}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={businessData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="taxId"
                      name="taxId"
                      value={businessData.taxId}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="address"
                    name="address"
                    value={businessData.address}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={businessData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      name="phone"
                      value={businessData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="website"
                      name="website"
                      value={businessData.website}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Tax Settings</CardTitle>
              <CardDescription>
                Configure payment methods and tax calculation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-8 text-center border rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto text-app-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-app-slate-900 mb-2">Billing Settings</h3>
                <p className="text-app-slate-500 max-w-md mx-auto mb-6">
                  Configure your default payment methods, billing address, and tax calculation preferences.
                </p>
                <Button variant="outline">
                  Configure Billing Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Access Control</CardTitle>
              <CardDescription>
                Manage who has access to this business and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-8 text-center border rounded-lg">
                <Users className="h-12 w-12 mx-auto text-app-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-app-slate-900 mb-2">Team Access</h3>
                <p className="text-app-slate-500 max-w-md mx-auto mb-6">
                  Invite team members and set their permissions for this business entity.
                </p>
                <Button asChild>
                  <Link to="/teams">
                    Manage Team Members
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-8 text-center border rounded-lg">
                <Bell className="h-12 w-12 mx-auto text-app-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-app-slate-900 mb-2">Notification Settings</h3>
                <p className="text-app-slate-500 max-w-md mx-auto mb-6">
                  Choose which notifications you want to receive and how you want to receive them.
                </p>
                <Button variant="outline">
                  Configure Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettings;
