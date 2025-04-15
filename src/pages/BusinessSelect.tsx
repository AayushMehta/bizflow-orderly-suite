
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";

// Mock business data
const allBusinesses = [
  {
    id: "NYC001",
    name: "New York Office",
    description: "Manufacturing and headquarters",
    createdAt: "2024-01-15",
    pendingDocuments: 0
  },
  {
    id: "LA002",
    name: "Los Angeles Branch",
    description: "West coast operations",
    createdAt: "2024-03-10",
    pendingDocuments: 2
  },
  {
    id: "CHI003",
    name: "Chicago Division",
    description: "Midwest distribution center",
    createdAt: "2024-05-22",
    pendingDocuments: 1
  }
];

const BusinessSelect = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<typeof allBusinesses>([]);

  useEffect(() => {
    if (user) {
      // Filter businesses based on user access
      const accessibleBusinesses = allBusinesses.filter(business => 
        user.role === "admin" || user.businesses.includes(business.id)
      );
      setBusinesses(accessibleBusinesses);
    }
  }, [user]);

  const handleSelectBusiness = (businessId: string) => {
    // Find the business by ID
    const selectedBusiness = businesses.find(b => b.id === businessId);
    
    if (selectedBusiness) {
      // Store selected business in localStorage
      localStorage.setItem("selectedBusiness", JSON.stringify(selectedBusiness));
      
      toast({
        title: "Business selected",
        description: `You are now working with ${selectedBusiness.name}.`
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    }
  };

  const handleCreateBusiness = () => {
    // Check if user has permission to create businesses
    if (user?.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only administrators can create new businesses."
      });
      return;
    }
    
    // Navigate to business onboarding page
    navigate("/business-onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-slate-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md border border-app-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-app-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-app-slate-900">Select Business</h1>
            <p className="text-app-slate-500">Choose which business you want to work with</p>
          </div>
          {user?.role === "admin" && (
            <Button onClick={handleCreateBusiness}>
              <Plus className="mr-2 h-4 w-4" />
              New Business
            </Button>
          )}
        </div>
        
        {businesses.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="h-12 w-12 mx-auto text-app-slate-300 mb-4" />
            <h2 className="text-lg font-medium text-app-slate-900 mb-2">No businesses available</h2>
            <p className="text-app-slate-500 max-w-md mx-auto mb-6">
              {user?.role === "admin" 
                ? "You don't have any businesses yet. Create your first business to get started." 
                : "You don't have access to any businesses. Please contact your administrator."}
            </p>
            {user?.role === "admin" && (
              <Button onClick={handleCreateBusiness}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Business
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="border border-app-slate-200 rounded-lg p-4 hover:border-app-blue-400 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleSelectBusiness(business.id)}
              >
                <div className="h-10 w-10 bg-app-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Building className="h-5 w-5 text-app-blue-600" />
                </div>
                <h3 className="font-medium text-app-slate-900">{business.name}</h3>
                <p className="text-sm text-app-slate-500 mt-1">{business.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-app-slate-400">ID: {business.id}</span>
                  <span className="text-xs text-app-slate-400">Created: {business.createdAt}</span>
                </div>
                {business.pendingDocuments > 0 && (
                  <div className="mt-2 pt-2 border-t border-app-slate-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {business.pendingDocuments} document{business.pendingDocuments !== 1 ? 's' : ''} pending
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-app-slate-200 bg-app-slate-50 flex justify-between items-center">
          <div className="text-sm text-app-slate-500">
            Logged in as <span className="font-medium">{user?.name}</span> ({user?.role})
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Change Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSelect;
