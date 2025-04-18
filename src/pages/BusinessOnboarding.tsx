
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  UploadCloud, 
  CheckCircle,
  Briefcase,
  Users,
  FileArchive,
  Mail,
  Phone,
  MapPin,
  Globe,
  UserCircle,
  ArrowLeft
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Business onboarding steps
const onboardingSteps = [
  {
    id: "overview",
    name: "Overview",
    description: "Overview of the onboarding process"
  },
  {
    id: "business-details",
    name: "Business Details",
    description: "Basic information about your business"
  },
  {
    id: "partner-details",
    name: "Partner Details",
    description: "Information about business partners"
  },
  {
    id: "documents",
    name: "Documents",
    description: "Upload necessary business documents"
  },
  {
    id: "review",
    name: "Review & Submit",
    description: "Review and submit your application"
  }
];

// Required documents for onboarding
const requiredDocuments = [
  { 
    id: "reg-cert", 
    name: "Business Registration Certificate", 
    description: "Official certificate of business registration",
    required: true 
  },
  { 
    id: "tax-id", 
    name: "Tax ID Documentation", 
    description: "Your business tax identification documents",
    required: true 
  },
  { 
    id: "bank-details", 
    name: "Bank Account Details", 
    description: "Proof of business bank account",
    required: true 
  },
  { 
    id: "address-proof", 
    name: "Proof of Business Address", 
    description: "Recent utility bill or lease agreement",
    required: true 
  },
  { 
    id: "id-proof", 
    name: "Identification Documents", 
    description: "ID proof of business owners/directors",
    required: true 
  },
  { 
    id: "partnership", 
    name: "Partnership Agreement", 
    description: "Agreement between business partners if applicable",
    required: false 
  },
  { 
    id: "licenses", 
    name: "Business Licenses", 
    description: "Any special licenses for your industry",
    required: false 
  }
];

// Mock business types
const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Non-profit Organization",
  "Other"
];

// Mock industries
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Construction",
  "Food & Beverage",
  "Transportation",
  "Hospitality",
  "Other"
];

// Mock countries for dropdown
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "China",
  "Japan",
  "Brazil",
  "Other"
];

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const { hasPermission } = useUser();
  const { toast } = useToast();
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  
  // State for document uploads
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  
  // State for business details form
  const [businessDetails, setBusinessDetails] = useState({
    name: "",
    type: "",
    industry: "",
    registrationNumber: "",
    taxId: "",
    foundingDate: "",
    employeeCount: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }
  });
  
  // State for partner details
  const [partners, setPartners] = useState([
    { 
      name: "", 
      email: "", 
      phone: "", 
      role: "", 
      ownership: "" 
    }
  ]);
  
  // Progress calculation
  const calculateProgress = () => {
    return ((currentStep) / (onboardingSteps.length - 1)) * 100;
  };
  
  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setUploadedDocs(prev => ({ ...prev, [docId]: file }));
      
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
  };
  
  // Handle bulk document upload
  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      // Create a new uploaded docs object
      const newUploadedDocs = { ...uploadedDocs };
      
      // Map files to document IDs based on name pattern (simple example)
      files.forEach(file => {
        // Simple logic to match files to document types
        // In a real app, this would be more sophisticated
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes("registration") || fileName.includes("certificate")) {
          newUploadedDocs["reg-cert"] = file;
        } else if (fileName.includes("tax")) {
          newUploadedDocs["tax-id"] = file;
        } else if (fileName.includes("bank")) {
          newUploadedDocs["bank-details"] = file;
        } else if (fileName.includes("address") || fileName.includes("utility")) {
          newUploadedDocs["address-proof"] = file;
        } else if (fileName.includes("id") || fileName.includes("passport")) {
          newUploadedDocs["id-proof"] = file;
        } else if (fileName.includes("partner") || fileName.includes("agreement")) {
          newUploadedDocs["partnership"] = file;
        } else if (fileName.includes("license")) {
          newUploadedDocs["licenses"] = file;
        }
      });
      
      setUploadedDocs(newUploadedDocs);
      
      toast({
        title: "Documents Uploaded",
        description: `${files.length} files have been uploaded.`
      });
    }
  };
  
  // Add a new partner field
  const addPartner = () => {
    setPartners([
      ...partners, 
      { name: "", email: "", phone: "", role: "", ownership: "" }
    ]);
  };
  
  // Remove a partner field
  const removePartner = (index: number) => {
    const updatedPartners = [...partners];
    updatedPartners.splice(index, 1);
    setPartners(updatedPartners);
  };
  
  // Update partner details
  const updatePartner = (index: number, field: string, value: string) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = { ...updatedPartners[index], [field]: value };
    setPartners(updatedPartners);
  };
  
  // Handle business details update
  const updateBusinessDetails = (field: string, value: string) => {
    // Handle nested address fields
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setBusinessDetails({
        ...businessDetails,
        address: {
          ...businessDetails.address,
          [addressField]: value
        }
      });
    } else {
      // Handle top-level fields
      setBusinessDetails({
        ...businessDetails,
        [field]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validation logic would go here in a real app
    
    toast({
      title: "Onboarding Completed",
      description: "Your business has been successfully onboarded!"
    });
    
    navigate("/dashboard");
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Check if current step is valid to proceed
  const isStepValid = () => {
    // Simple validation - in a real app this would be more thorough
    switch (currentStep) {
      case 0: // Overview
        return true;
      case 1: // Business Details
        return businessDetails.name && 
               businessDetails.type && 
               businessDetails.email &&
               businessDetails.address.country;
      case 2: // Partner Details
        return partners.every(p => p.name && p.email);
      case 3: // Documents
        const requiredDocIds = requiredDocuments
          .filter(doc => doc.required)
          .map(doc => doc.id);
        return requiredDocIds.every(id => uploadedDocs[id]);
      case 4: // Review
        return true;
      default:
        return false;
    }
  };
  
  // Add a method to handle going back to the previous page
  const goBack = () => {
    navigate(-1);  // This navigates to the previous page in the browser history
  };
  
  // If user doesn't have permission, redirect to dashboard
  if (!hasPermission("create", "business")) {
    navigate("/dashboard");
    return null;
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          Business Onboarding
        </h1>
        <div className="w-20"></div> {/* Empty div for balance */}
      </div>
      
      <p className="text-muted-foreground">
        Complete the following steps to onboard your business
      </p>
      
      <Progress value={calculateProgress()} className="h-2" />
      
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <div className="space-y-2 sticky top-6">
            {onboardingSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`p-3 rounded-md flex items-center gap-2 cursor-pointer transition-colors ${
                  currentStep === index 
                    ? "bg-primary text-primary-foreground" 
                    : index < currentStep 
                      ? "bg-muted text-muted-foreground" 
                      : "bg-background text-foreground border"
                }`}
                onClick={() => {
                  // Only allow navigating to completed steps or current step
                  if (index <= currentStep) {
                    setCurrentStep(index);
                  }
                }}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border">
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{step.name}</div>
                  <div className="text-xs hidden sm:block">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-3">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>{onboardingSteps[currentStep].name}</CardTitle>
              <CardDescription>{onboardingSteps[currentStep].description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Step 1: Overview */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Building className="h-5 w-5 text-primary" />
                    Welcome to the Business Onboarding Process
                  </div>
                  
                  <p>
                    This wizard will guide you through the process of onboarding your business 
                    to our platform. Please have the following information ready:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span>Basic business information (name, type, registration details)</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Details about business partners and ownership structure</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FileArchive className="h-4 w-4 text-primary" />
                      <span>Required documents for verification</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2">Required Documents:</h3>
                    <div className="space-y-2">
                      {requiredDocuments.map(doc => (
                        <div key={doc.id} className="flex gap-2 items-center">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{doc.name}</span>
                          {doc.required ? (
                            <Badge variant="default">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Business Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="business-name" className="text-sm font-medium">Business Name*</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="business-name"
                          placeholder="Enter business name" 
                          className="pl-10"
                          value={businessDetails.name}
                          onChange={(e) => updateBusinessDetails("name", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="business-type" className="text-sm font-medium">Business Type*</label>
                      <Select 
                        value={businessDetails.type}
                        onValueChange={(value) => updateBusinessDetails("type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="business-industry" className="text-sm font-medium">Industry*</label>
                      <Select 
                        value={businessDetails.industry}
                        onValueChange={(value) => updateBusinessDetails("industry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="business-registration" className="text-sm font-medium">Registration Number*</label>
                      <Input 
                        id="business-registration"
                        placeholder="Enter registration number" 
                        value={businessDetails.registrationNumber}
                        onChange={(e) => updateBusinessDetails("registrationNumber", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="business-tax" className="text-sm font-medium">Tax ID*</label>
                      <Input 
                        id="business-tax"
                        placeholder="Enter tax ID" 
                        value={businessDetails.taxId}
                        onChange={(e) => updateBusinessDetails("taxId", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="business-founded" className="text-sm font-medium">Founded Date</label>
                      <Input 
                        id="business-founded"
                        type="date"
                        value={businessDetails.foundingDate}
                        onChange={(e) => updateBusinessDetails("foundingDate", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="employee-count" className="text-sm font-medium">Number of Employees</label>
                      <Input 
                        id="employee-count"
                        type="number"
                        placeholder="Enter employee count" 
                        value={businessDetails.employeeCount}
                        onChange={(e) => updateBusinessDetails("employeeCount", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-md font-medium mb-4">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="business-email" className="text-sm font-medium">Business Email*</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="business-email"
                            type="email"
                            placeholder="Enter business email" 
                            className="pl-10"
                            value={businessDetails.email}
                            onChange={(e) => updateBusinessDetails("email", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="business-phone" className="text-sm font-medium">Business Phone*</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="business-phone"
                            placeholder="Enter business phone" 
                            className="pl-10"
                            value={businessDetails.phone}
                            onChange={(e) => updateBusinessDetails("phone", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="business-website" className="text-sm font-medium">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="business-website"
                            placeholder="Enter website URL" 
                            className="pl-10"
                            value={businessDetails.website}
                            onChange={(e) => updateBusinessDetails("website", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-md font-medium mb-4">Business Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <label htmlFor="address-street" className="text-sm font-medium">Street Address*</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="address-street"
                            placeholder="Enter street address" 
                            className="pl-10"
                            value={businessDetails.address.street}
                            onChange={(e) => updateBusinessDetails("address.street", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address-city" className="text-sm font-medium">City*</label>
                        <Input 
                          id="address-city"
                          placeholder="Enter city" 
                          value={businessDetails.address.city}
                          onChange={(e) => updateBusinessDetails("address.city", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address-state" className="text-sm font-medium">State/Province*</label>
                        <Input 
                          id="address-state"
                          placeholder="Enter state or province" 
                          value={businessDetails.address.state}
                          onChange={(e) => updateBusinessDetails("address.state", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address-postal" className="text-sm font-medium">Postal Code*</label>
                        <Input 
                          id="address-postal"
                          placeholder="Enter postal code" 
                          value={businessDetails.address.postalCode}
                          onChange={(e) => updateBusinessDetails("address.postalCode", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address-country" className="text-sm font-medium">Country*</label>
                        <Select 
                          value={businessDetails.address.country}
                          onValueChange={(value) => updateBusinessDetails("address.country", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Partner Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">Partner/Owner Information</h3>
                    <Button variant="outline" size="sm" onClick={addPartner}>
                      Add Partner
                    </Button>
                  </div>
                  
                  {partners.map((partner, index) => (
                    <div key={index} className="space-y-4 border rounded-md p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-primary" />
                          Partner {index + 1}
                        </h4>
                        {partners.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removePartner(index)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name*</label>
                          <Input 
                            placeholder="Enter full name" 
                            value={partner.name}
                            onChange={(e) => updatePartner(index, "name", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address*</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="email"
                              placeholder="Enter email address" 
                              className="pl-10"
                              value={partner.email}
                              onChange={(e) => updatePartner(index, "email", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter phone number" 
                              className="pl-10"
                              value={partner.phone}
                              onChange={(e) => updatePartner(index, "phone", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Role in Business</label>
                          <Input 
                            placeholder="E.g., CEO, Managing Director, etc." 
                            value={partner.role}
                            onChange={(e) => updatePartner(index, "role", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ownership Percentage</label>
                          <Input 
                            type="number"
                            placeholder="Enter percentage" 
                            min="0"
                            max="100"
                            value={partner.ownership}
                            onChange={(e) => updatePartner(index, "ownership", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Step 4: Documents */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-md font-medium mb-2">Bulk Upload</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload multiple documents at once. Please ensure file names clearly indicate document types.
                    </p>
                    
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        id="bulk-file-upload"
                        onChange={handleBulkUpload}
                      />
                      <label htmlFor="bulk-file-upload">
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <span>Select Files</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-md font-medium mb-4">Required Documents</h3>
                    
                    <div className="space-y-4">
                      {requiredDocuments.map(doc => (
                        <div 
                          key={doc.id} 
                          className={`border rounded-md p-4 ${
                            uploadedDocs[doc.id] 
                              ? "border-green-500 bg-green-50" 
                              : doc.required 
                                ? "border-red-200" 
                                : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {doc.name}
                                {doc.required ? (
                                  <Badge variant="default">Required</Badge>
                                ) : (
                                  <Badge variant="outline">Optional</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {doc.description}
                              </p>
                            </div>
                            
                            <div className="ml-4">
                              {uploadedDocs[doc.id] ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <span className="text-sm text-green-600">Uploaded</span>
                                </div>
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    id={`file-upload-${doc.id}`}
                                    onChange={(e) => handleDocumentUpload(e, doc.id)}
                                  />
                                  <label htmlFor={`file-upload-${doc.id}`}>
                                    <Button variant="outline" size="sm" asChild>
                                      <span>Upload</span>
                                    </Button>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {uploadedDocs[doc.id] && (
                            <div className="mt-2 text-sm flex items-center gap-2 bg-muted p-2 rounded">
                              <FileText className="h-4 w-4" />
                              <span>{uploadedDocs[doc.id]?.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 5: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500 inline mr-2" />
                    <span className="font-medium">Review your information and submit your application</span>
                  </div>
                  
                  <Tabs defaultValue="business">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="business">Business Details</TabsTrigger>
                      <TabsTrigger value="partners">Partners</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="business" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Business Name</h4>
                          <p>{businessDetails.name || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Business Type</h4>
                          <p>{businessDetails.type || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Industry</h4>
                          <p>{businessDetails.industry || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Registration Number</h4>
                          <p>{businessDetails.registrationNumber || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Tax ID</h4>
                          <p>{businessDetails.taxId || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Founded Date</h4>
                          <p>{businessDetails.foundingDate || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                            <p>{businessDetails.email || "Not provided"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                            <p>{businessDetails.phone || "Not provided"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Website</h4>
                            <p>{businessDetails.website || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium mb-2">Business Address</h4>
                        <p>
                          {businessDetails.address.street ? businessDetails.address.street + ", " : ""}
                          {businessDetails.address.city ? businessDetails.address.city + ", " : ""}
                          {businessDetails.address.state ? businessDetails.address.state + ", " : ""}
                          {businessDetails.address.postalCode ? businessDetails.address.postalCode + ", " : ""}
                          {businessDetails.address.country || "Not provided"}
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="partners" className="space-y-4 mt-4">
                      {partners.length > 0 ? (
                        partners.map((partner, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">Partner {index + 1}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                                <p>{partner.name || "Not provided"}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                <p>{partner.email || "Not provided"}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                <p>{partner.phone || "Not provided"}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                                <p>{partner.role || "Not provided"}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Ownership</h4>
                                <p>{partner.ownership ? `${partner.ownership}%` : "Not provided"}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No partners added</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="documents" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        {requiredDocuments.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span>{doc.name}</span>
                              {doc.required && <Badge variant="default">Required</Badge>}
                            </div>
                            
                            <div>
                              {uploadedDocs[doc.id] ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-600">Uploaded</span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-red-500">
                                  Not Uploaded
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < onboardingSteps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="flex items-center gap-1"
                >
                  Submit Application
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;

