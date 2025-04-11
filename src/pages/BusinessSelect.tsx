
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Business {
  id: string;
  name: string;
  location: string;
  businessId: string;
}

const BusinessSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock businesses data
  const [businesses, setBusinesses] = useState<Business[]>([
    { 
      id: "1", 
      name: "New York Office", 
      location: "New York, NY", 
      businessId: "NYC001" 
    },
    { 
      id: "2", 
      name: "Los Angeles Branch", 
      location: "Los Angeles, CA", 
      businessId: "LA002" 
    },
    { 
      id: "3", 
      name: "Chicago Division", 
      location: "Chicago, IL", 
      businessId: "CHI003" 
    },
  ]);
  
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: "",
    location: "",
  });
  
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleSelectBusiness = (business: Business) => {
    // In a real app, you'd store the selected business in context/state
    localStorage.setItem("selectedBusiness", JSON.stringify(business));
    toast({
      title: "Business Selected",
      description: `You are now working with ${business.name}`,
    });
    navigate("/");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingBusiness) {
      setEditingBusiness({ ...editingBusiness, [name]: value });
    } else {
      setNewBusiness({ ...newBusiness, [name]: value });
    }
  };
  
  const handleAddBusiness = () => {
    if (!newBusiness.name || !newBusiness.location) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both name and location.",
      });
      return;
    }
    
    // Generate a business ID based on location
    const locationPrefix = newBusiness.location?.split(",")[0].substring(0, 3).toUpperCase();
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
    const businessId = `${locationPrefix}${randomNum}`;
    
    const newBusinessComplete = {
      id: Date.now().toString(),
      name: newBusiness.name,
      location: newBusiness.location,
      businessId,
    };
    
    setBusinesses([...businesses, newBusinessComplete]);
    setNewBusiness({ name: "", location: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Business Added",
      description: `${newBusinessComplete.name} has been added to your account.`,
    });
  };
  
  const handleEditBusiness = () => {
    if (!editingBusiness || !editingBusiness.name || !editingBusiness.location) {
      return;
    }
    
    setBusinesses(businesses.map(b => 
      b.id === editingBusiness.id ? editingBusiness : b
    ));
    
    setEditingBusiness(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Business Updated",
      description: `${editingBusiness.name} has been updated.`,
    });
  };
  
  const handleDeleteBusiness = (id: string) => {
    setBusinesses(businesses.filter(b => b.id !== id));
    
    toast({
      title: "Business Removed",
      description: "The business has been removed from your account.",
    });
  };
  
  const openEditDialog = (business: Business) => {
    setEditingBusiness(business);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-slate-50">
      <header className="bg-white border-b border-app-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-app-blue-600" />
            <span className="text-lg font-bold text-app-slate-900">BizFlow</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/login")}>Logout</Button>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-app-slate-900">Select a Business</h1>
            <p className="text-app-slate-500">Choose a business to manage or add a new one</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Business
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBusiness ? "Edit Business" : "Add New Business"}</DialogTitle>
                <DialogDescription>
                  {editingBusiness 
                    ? "Update the business details below." 
                    : "Fill in the details to add a new business to your account."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Business Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., New York Office"
                    value={editingBusiness ? editingBusiness.name : newBusiness.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., New York, NY"
                    value={editingBusiness ? editingBusiness.location : newBusiness.location}
                    onChange={handleInputChange}
                  />
                </div>
                
                {editingBusiness && (
                  <div className="space-y-2">
                    <label htmlFor="businessId" className="text-sm font-medium">
                      Business ID
                    </label>
                    <Input
                      id="businessId"
                      disabled
                      value={editingBusiness.businessId}
                    />
                    <p className="text-xs text-app-slate-500">Business ID cannot be changed</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingBusiness(null);
                  setNewBusiness({ name: "", location: "" });
                }}>
                  Cancel
                </Button>
                <Button onClick={editingBusiness ? handleEditBusiness : handleAddBusiness}>
                  {editingBusiness ? "Save Changes" : "Add Business"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="border border-app-slate-200 hover:border-app-blue-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription>{business.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium flex items-center">
                  <span className="text-app-slate-500 mr-2">ID:</span>
                  <span className="bg-app-slate-100 px-2 py-1 rounded font-mono text-app-slate-800">
                    {business.businessId}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => openEditDialog(business)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove {business.name} from your account. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDeleteBusiness(business.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <Button onClick={() => handleSelectBusiness(business)}>
                  Select
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BusinessSelect;
