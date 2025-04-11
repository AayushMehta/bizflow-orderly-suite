
import { useParams, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ShoppingCart, 
  Receipt, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

// Mock client data
const mockClient = {
  id: "CL001",
  name: "Acme Corporation",
  contact: "John Smith",
  email: "john@acme.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Suite 400, New York, NY 10001",
  status: "active",
  taxId: "TAX-9876543",
  dateCreated: "2024-01-15",
  totalOrders: 12,
  totalSpent: 157890,
  lastOrder: "2025-03-10",
  notes: "Important corporate client with multiple manufacturing needs."
};

// Mock orders data
const mockOrders = [
  { id: "PO001", type: "purchase-order", date: "2025-03-10", amount: 12500, status: "delivered" },
  { id: "INV003", type: "invoice", date: "2025-03-15", amount: 12500, status: "paid" },
  { id: "QT007", type: "quotation", date: "2025-02-28", amount: 12500, status: "approved" },
  { id: "PO002", type: "purchase-order", date: "2025-01-20", amount: 8750, status: "delivered" },
  { id: "INV001", type: "invoice", date: "2025-01-25", amount: 8750, status: "paid" }
];

const getStatusBadge = (status: string, type: string) => {
  const statusMap = {
    "delivered": { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    "in-production": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
    "approved": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    "pending": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
    "paid": { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    "overdue": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    "active": { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
    "inactive": { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  };

  const style = statusMap[status as keyof typeof statusMap] || { bg: "", text: "", border: "" };
  
  return (
    <Badge 
      variant="outline" 
      className={`${style.bg} ${style.text} ${style.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getOrderIcon = (type: string) => {
  switch (type) {
    case "quotation":
      return <FileText className="h-4 w-4" />;
    case "purchase-order":
      return <ShoppingCart className="h-4 w-4" />;
    case "invoice":
      return <Receipt className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getOrderPath = (type: string, id: string) => {
  switch (type) {
    case "quotation":
      return `/quotations/${id}`;
    case "purchase-order":
      return `/purchase-orders/${id}`;
    case "invoice":
      return `/invoices/${id}`;
    default:
      return "#";
  }
};

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real application, you would fetch the client data based on the ID
  // For this demo, we're using the mock data

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <div className="flex items-center mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 -ml-2"
              asChild
            >
              <Link to="/clients">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-app-slate-900">{mockClient.name}</h1>
          <div className="flex items-center mt-1">
            <Badge className="mr-2">{mockClient.id}</Badge>
            {getStatusBadge(mockClient.status, "client")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/quotations">
              <FileText className="mr-2 h-4 w-4" />
              New Quotation
            </Link>
          </Button>
          <Button asChild>
            <Link to="#">
              Edit Client
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{mockClient.contact}</p>
                    <p className="text-sm text-app-slate-500">Primary Contact</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-app-slate-400 mt-0.5" />
                  <div>
                    <a href={`mailto:${mockClient.email}`} className="font-medium text-app-blue-600 hover:underline">
                      {mockClient.email}
                    </a>
                    <p className="text-sm text-app-slate-500">Email</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-app-slate-400 mt-0.5" />
                  <div>
                    <a href={`tel:${mockClient.phone}`} className="font-medium">
                      {mockClient.phone}
                    </a>
                    <p className="text-sm text-app-slate-500">Phone</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-app-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{mockClient.address}</p>
                    <p className="text-sm text-app-slate-500">Business Address</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-app-slate-500">Tax ID:</span>
                  <span className="font-medium">{mockClient.taxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-slate-500">Customer Since:</span>
                  <span className="font-medium">{mockClient.dateCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-slate-500">Total Orders:</span>
                  <span className="font-medium">{mockClient.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-slate-500">Last Order:</span>
                  <span className="font-medium">{mockClient.lastOrder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-slate-500">Total Amount:</span>
                  <span className="font-medium">${mockClient.totalSpent.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-app-slate-700">{mockClient.notes}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                View all orders, quotations, and invoices for this client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="mr-4 h-9 w-9 rounded-full bg-app-slate-100 flex items-center justify-center">
                        {getOrderIcon(order.type)}
                      </div>
                      <div>
                        <Link 
                          to={getOrderPath(order.type, order.id)}
                          className="font-medium text-app-blue-600 hover:underline"
                        >
                          {order.id}
                        </Link>
                        <p className="text-sm text-app-slate-500 capitalize">
                          {order.type.replace("-", " ")} • {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${order.amount.toLocaleString()}</p>
                        <div className="mt-1">
                          {getStatusBadge(order.status, order.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Documents</CardTitle>
              <CardDescription>
                View and manage client-related documents and files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <p className="text-app-slate-500">No documents available yet</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
