
import { useState } from "react";
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Users, 
  Settings, 
  BookOpen,
  Receipt,
  Landmark,
  Save,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const BusinessSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your business settings have been updated successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Business Settings</h1>
          <p className="text-app-slate-500">Manage your business profile and preferences</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 sm:w-[600px] mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">User Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <div className="relative mt-1">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="business-name"
                      className="pl-10" 
                      placeholder="Enter business name" 
                      defaultValue="Acme Corporation"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="contact-person"
                        className="pl-10" 
                        placeholder="Primary contact name" 
                        defaultValue="John Smith"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="business-email">Business Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="business-email"
                        className="pl-10" 
                        placeholder="Enter email address" 
                        defaultValue="info@acme.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="business-phone"
                        className="pl-10" 
                        placeholder="Enter phone number" 
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tax-id">Tax ID / Business Number</Label>
                    <div className="relative mt-1">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="tax-id"
                        className="pl-10" 
                        placeholder="Enter tax ID" 
                        defaultValue="US-987654321"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="business-address">Business Address</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="business-address"
                      className="pl-10" 
                      placeholder="Enter business address" 
                      defaultValue="123 Corporate Plaza, Suite 500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      placeholder="City" 
                      defaultValue="New York"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state"
                      placeholder="State/Province" 
                      defaultValue="NY"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal-code">Postal/ZIP Code</Label>
                    <Input 
                      id="postal-code"
                      placeholder="Postal/ZIP code" 
                      defaultValue="10001"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="USA">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="CAN">Canada</SelectItem>
                        <SelectItem value="GBR">United Kingdom</SelectItem>
                        <SelectItem value="AUS">Australia</SelectItem>
                      </SelectContent>
                    </Select>
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
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>
                Configure payment methods, banking details and tax settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input 
                    id="tax-rate"
                    type="number" 
                    min="0" 
                    max="100" 
                    defaultValue="8.5" 
                  />
                </div>
                
                <div>
                  <Label>Banking Information</Label>
                  <Card className="mt-2">
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <div className="relative mt-1">
                            <Landmark className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="bank-name"
                              className="pl-10" 
                              placeholder="Enter bank name" 
                              defaultValue="First National Bank"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="account-number">Account Number</Label>
                          <div className="relative mt-1">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="account-number"
                              className="pl-10" 
                              placeholder="Enter account number" 
                              defaultValue="****4567"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="payment-instructions">Payment Instructions</Label>
                        <Textarea 
                          id="payment-instructions"
                          placeholder="Enter payment instructions to include on invoices"
                          className="min-h-[100px]"
                          defaultValue="Please include the invoice number in your payment reference. All payments are due within 30 days."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="auto-invoice" defaultChecked />
                  <Label htmlFor="auto-invoice">Enable automatic invoice generation for new orders</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Financial Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Settings</CardTitle>
              <CardDescription>
                Configure document templates and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input 
                    id="invoice-prefix"
                    placeholder="e.g., INV-" 
                    defaultValue="INV-" 
                  />
                  <p className="text-sm text-muted-foreground mt-1">Used for generating invoice numbers</p>
                </div>
                
                <div>
                  <Label htmlFor="quote-prefix">Quotation Number Prefix</Label>
                  <Input 
                    id="quote-prefix"
                    placeholder="e.g., QT-" 
                    defaultValue="QT-" 
                  />
                  <p className="text-sm text-muted-foreground mt-1">Used for generating quotation numbers</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Upload Company Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Recommended size: 200x200px. Max file size: 2MB</p>
              </div>
              
              <div className="mt-6 flex flex-col space-y-4">
                <Label>Document Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="pt-6 text-center">
                      <Receipt className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                      <CardTitle className="text-base mb-2">Invoice Template</CardTitle>
                      <Button variant="outline" size="sm">
                        Customize
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                      <CardTitle className="text-base mb-2">Quotation Template</CardTitle>
                      <Button variant="outline" size="sm">
                        Customize
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:border-primary">
                    <CardContent className="pt-6 text-center">
                      <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                      <CardTitle className="text-base mb-2">Statement Template</CardTitle>
                      <Button variant="outline" size="sm">
                        Customize
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Document Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Access</CardTitle>
              <CardDescription>
                Manage user access and permissions for this business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              <div className="border rounded-md">
                <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50 font-medium">
                  <div className="col-span-2">User</div>
                  <div>Role</div>
                  <div>Last Login</div>
                  <div className="text-right">Actions</div>
                </div>
                
                <div className="divide-y">
                  <div className="grid grid-cols-5 gap-4 p-4 items-center">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">sarah@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Badge>Admin</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Today, 10:34 AM</div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 p-4 items-center">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Michael Chen</p>
                        <p className="text-sm text-muted-foreground">michael@example.com</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline">Staff</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Yesterday, 2:15 PM</div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Access Control</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Invoicing Access</p>
                      <p className="text-sm text-muted-foreground">Control who can create and edit invoices</p>
                    </div>
                    <Select defaultValue="admins">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="staff">Staff & Admins</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Client Management</p>
                      <p className="text-sm text-muted-foreground">Control who can add and edit clients</p>
                    </div>
                    <Select defaultValue="staff">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="staff">Staff & Admins</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Financial Reports</p>
                      <p className="text-sm text-muted-foreground">Control who can view financial reports</p>
                    </div>
                    <Select defaultValue="admins">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="staff">Staff & Admins</SelectItem>
                        <SelectItem value="all">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save User Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettings;
