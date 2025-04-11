
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingCart, 
  FileText, 
  User, 
  Calendar, 
  Truck, 
  ArrowDownToLine, 
  ArrowLeft,
  Receipt,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Mock purchase order data
const mockPurchaseOrder = {
  id: "PO003",
  date: "2025-03-07",
  deliveryDate: "2025-04-05",
  amount: 22350,
  status: "in-production",
  productionProgress: 65,
  client: {
    id: "CL003",
    name: "Stark Enterprises",
    contact: "Tony Stark",
    email: "tony@stark.com",
    address: "200 Park Avenue, New York, NY 10166",
  },
  quotation: "QT007",
  invoices: [
    { id: "INV003", date: "2025-03-15", amount: 12500, status: "paid" }
  ],
  items: [
    { 
      id: 1, 
      description: "Custom Steel Components", 
      quantity: 50, 
      unitPrice: 240, 
      total: 12000,
      status: "completed",
      progress: 100
    },
    { 
      id: 2, 
      description: "Assembly Service", 
      quantity: 30, 
      unitPrice: 290, 
      total: 8700,
      status: "in-progress",
      progress: 60
    },
    { 
      id: 3, 
      description: "Quality Testing", 
      quantity: 10, 
      unitPrice: 165, 
      total: 1650,
      status: "pending",
      progress: 0
    },
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in-production":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">In Production</Badge>;
    case "ready-for-delivery":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Ready for Delivery</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
    case "in-progress":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">In Progress</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Pending</Badge>;
    case "paid":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Paid</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getItemProgressColor = (progress: number) => {
  if (progress >= 100) return "bg-green-500";
  if (progress >= 50) return "bg-amber-500";
  return "bg-gray-300";
};

const PurchaseOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real application, you would fetch the PO data based on the ID
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
              <Link to="/purchase-orders">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-app-slate-900">Purchase Order #{mockPurchaseOrder.id}</h1>
            {getStatusBadge(mockPurchaseOrder.status)}
          </div>
          <div className="flex items-center mt-1 text-app-slate-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-3">Ordered: {mockPurchaseOrder.date}</span>
            <Truck className="h-4 w-4 mr-1 ml-2" />
            <span>Expected Delivery: {mockPurchaseOrder.deliveryDate}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <Receipt className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Manufacturing Progress</CardTitle>
                <div className="text-right">
                  <span className="text-2xl font-bold">{mockPurchaseOrder.productionProgress}%</span>
                  <p className="text-sm text-app-slate-500">Completion</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={mockPurchaseOrder.productionProgress} className="h-2 mb-6" />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${getItemProgressColor(item.progress)}`}
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.progress}% Complete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium text-lg">Total</TableCell>
                    <TableCell className="text-right font-bold text-lg">${mockPurchaseOrder.amount.toLocaleString()}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Related Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {mockPurchaseOrder.invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPurchaseOrder.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/invoices/${invoice.id}`}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-app-slate-500">
                  No invoices created yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-app-slate-400 mt-0.5" />
                  <div>
                    <Link 
                      to={`/clients/${mockPurchaseOrder.client.id}`}
                      className="font-medium text-app-blue-600 hover:underline"
                    >
                      {mockPurchaseOrder.client.name}
                    </Link>
                    <p className="text-sm text-app-slate-500">Client</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="font-medium">{mockPurchaseOrder.client.contact}</p>
                  <p className="text-app-slate-500">{mockPurchaseOrder.client.email}</p>
                  <p className="text-app-slate-500 mt-2">{mockPurchaseOrder.client.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Status:</span>
                  <span className="font-medium capitalize">{mockPurchaseOrder.status.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Quotation Reference:</span>
                  <Link 
                    to={`/quotations/${mockPurchaseOrder.quotation}`}
                    className="font-medium text-app-blue-600 hover:underline"
                  >
                    {mockPurchaseOrder.quotation}
                  </Link>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Order Date:</span>
                  <span className="font-medium">{mockPurchaseOrder.date}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Expected Delivery:</span>
                  <span className="font-medium">{mockPurchaseOrder.deliveryDate}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Production Notes
                </Button>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
