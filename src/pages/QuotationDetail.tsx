
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Printer,
  Download,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  CalendarClock,
  User,
  Building,
  Phone,
  Mail as MailIcon,
  DollarSign,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Quotation {
  id: string;
  number: string;
  client: Client;
  date: string;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  notes: string;
  version: number;
}

const QuotationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Mock quotation data
  const quotation: Quotation = {
    id: "1",
    number: "QT-2025-045",
    client: {
      id: "C001",
      name: "Acme Corp",
      contact: "John Smith",
      email: "john.smith@acmecorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      taxId: "TAX-98765432",
    },
    date: "2025-04-10",
    validUntil: "2025-05-10",
    items: [
      {
        id: "item1",
        description: "Custom Steel Brackets - 50mm",
        quantity: 100,
        unitPrice: 45.00,
        amount: 4500.00
      },
      {
        id: "item2",
        description: "Aluminum Panel Sheets - 4x8ft",
        quantity: 25,
        unitPrice: 180.00,
        amount: 4500.00
      },
      {
        id: "item3",
        description: "Installation Service - Per Hour",
        quantity: 20,
        unitPrice: 75.00,
        amount: 1500.00
      },
      {
        id: "item4",
        description: "Design Consultation",
        quantity: 1,
        unitPrice: 2000.00,
        amount: 2000.00
      }
    ],
    subtotal: 12500.00,
    taxRate: 8.5,
    taxAmount: 1062.50,
    total: 13562.50,
    status: "Pending Approval",
    notes: "This quotation includes installation services and an initial design consultation. Delivery within 3 weeks after order confirmation.",
    version: 1
  };
  
  // Get status color styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending Approval":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Expired":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Draft":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Pending Approval":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Expired":
        return <CalendarClock className="h-4 w-4 text-gray-500" />;
      case "Draft":
        return <Edit className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Handle approve quotation
  const handleApproveQuotation = () => {
    toast({
      title: "Quotation Approved",
      description: `Quotation ${quotation.number} has been approved.`,
    });
    setApprovalDialogOpen(false);
    // In a real app, you'd update the quotation status via API
  };
  
  // Handle reject quotation
  const handleRejectQuotation = () => {
    if (!rejectionReason.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    
    toast({
      title: "Quotation Rejected",
      description: `Quotation ${quotation.number} has been rejected.`,
    });
    setRejectionDialogOpen(false);
    setRejectionReason("");
    // In a real app, you'd update the quotation status via API
  };
  
  // Handle convert to purchase order
  const handleConvertToPO = () => {
    toast({
      title: "Converting to Purchase Order",
      description: "Creating a new purchase order based on this quotation.",
    });
    navigate("/purchase-orders/new?from=quotation&id=" + id);
  };
  
  if (!quotation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/quotations")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-app-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-app-blue-600" />
              {quotation.number}
            </h1>
            <div className="flex items-center gap-2 text-sm text-app-slate-500">
              <span>Created: {new Date(quotation.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>Valid until: {new Date(quotation.validUntil).toLocaleDateString()}</span>
              {quotation.version > 1 && (
                <>
                  <span>•</span>
                  <span>Version: {quotation.version}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
          
          {quotation.status === "Pending Approval" && (
            <>
              <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Quotation</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to approve this quotation? This will mark it as accepted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApproveQuotation}>
                      Approve Quotation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Quotation</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this quotation.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea 
                    placeholder="Reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleRejectQuotation}
                    >
                      Reject Quotation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          
          {quotation.status === "Approved" && (
            <Button size="sm" className="gap-1" onClick={handleConvertToPO}>
              <Plus className="h-4 w-4" />
              <span>Create Purchase Order</span>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/quotations/${id}/edit`)}>
                Edit Quotation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/quotations/${id}/duplicate`)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Quotation Details</CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(quotation.status)}`}>
                  {getStatusIcon(quotation.status)}
                  {quotation.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotation.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-app-slate-600">Subtotal</span>
                  <span className="font-medium">${quotation.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-slate-600">Tax ({quotation.taxRate}%)</span>
                  <span className="font-medium">${quotation.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${quotation.total.toFixed(2)}</span>
                </div>
              </div>
              
              {quotation.notes && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-app-slate-600 text-sm whitespace-pre-line">{quotation.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{quotation.client.name}</p>
                    <p className="text-sm text-app-slate-500">Tax ID: {quotation.client.taxId}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{quotation.client.contact}</p>
                    <p className="text-sm text-app-slate-500">Contact Person</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{quotation.client.phone}</p>
                    <p className="text-sm text-app-slate-500">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MailIcon className="h-4 w-4 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{quotation.client.email}</p>
                    <p className="text-sm text-app-slate-500">Email</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-app-slate-500">{quotation.client.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/clients/${quotation.client.id}`}>
                  View Client Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Status</span>
                  <Badge variant="outline" className={getStatusColor(quotation.status)}>
                    {quotation.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Total Value</span>
                  <span className="font-medium">${quotation.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Tax Amount</span>
                  <span className="font-medium">${quotation.taxAmount.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Created On</span>
                  <span className="font-medium">{new Date(quotation.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Valid Until</span>
                  <span className="font-medium">{new Date(quotation.validUntil).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-slate-500">Days Remaining</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    30 days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
