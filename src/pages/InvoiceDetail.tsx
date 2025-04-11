
import { useParams, Link } from "react-router-dom";
import { 
  Receipt, 
  Calendar, 
  User, 
  CreditCard, 
  ShoppingCart, 
  ArrowDownToLine, 
  ArrowLeft,
  CheckCircle2,
  Clock
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
import { Progress } from "@/components/ui/progress";

// Mock invoice data
const mockInvoice = {
  id: "INV003",
  date: "2025-03-15",
  dueDate: "2025-04-15",
  amount: 22350,
  tax: 1950,
  total: 24300,
  status: "paid",
  paymentDate: "2025-03-20",
  paymentMethod: "Bank Transfer",
  poReference: "PO003",
  client: {
    id: "CL003",
    name: "Stark Enterprises",
    contact: "Tony Stark",
    email: "tony@stark.com",
    address: "200 Park Avenue, New York, NY 10166",
  },
  items: [
    { id: 1, description: "Custom Steel Components", quantity: 50, unitPrice: 240, total: 12000 },
    { id: 2, description: "Assembly Service", quantity: 30, unitPrice: 290, total: 8700 },
    { id: 3, description: "Quality Testing", quantity: 10, unitPrice: 165, total: 1650 },
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <div className="flex items-center gap-1 text-green-700">
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center gap-1 text-amber-700">
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        </div>
      );
    case "overdue":
      return (
        <div className="flex items-center gap-1 text-red-700">
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
            Overdue
          </Badge>
        </div>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real application, you would fetch the invoice data based on the ID
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
              <Link to="/invoices">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-app-slate-900">Invoice #{mockInvoice.id}</h1>
            {getStatusBadge(mockInvoice.status)}
          </div>
          <div className="flex items-center mt-1 text-app-slate-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-3">Issued: {mockInvoice.date}</span>
            <span>Due: {mockInvoice.dueDate}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                    <TableCell className="text-right font-medium">${mockInvoice.amount.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Tax (GST)</TableCell>
                    <TableCell className="text-right">${mockInvoice.tax.toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium text-lg">Total</TableCell>
                    <TableCell className="text-right font-bold text-lg">${mockInvoice.total.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Payment Status:</span>
                  <span className="font-medium capitalize">{mockInvoice.status}</span>
                </div>
                {mockInvoice.status === "paid" && (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-app-slate-500">Payment Date:</span>
                      <span className="font-medium">{mockInvoice.paymentDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-app-slate-500">Payment Method:</span>
                      <span className="font-medium">{mockInvoice.paymentMethod}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="text-app-slate-500">Purchase Order:</span>
                  <Link to={`/purchase-orders/${mockInvoice.poReference}`} className="font-medium text-app-blue-600 hover:underline">
                    {mockInvoice.poReference}
                  </Link>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Payment Progress</h4>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between mt-2 text-sm">
                  <span>$0</span>
                  <span className="font-medium">${mockInvoice.total.toLocaleString()} Paid</span>
                </div>
              </div>
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
                      to={`/clients/${mockInvoice.client.id}`}
                      className="font-medium text-app-blue-600 hover:underline"
                    >
                      {mockInvoice.client.name}
                    </Link>
                    <p className="text-sm text-app-slate-500">Client</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="font-medium">{mockInvoice.client.contact}</p>
                  <p className="text-app-slate-500">{mockInvoice.client.email}</p>
                  <p className="text-app-slate-500 mt-2">{mockInvoice.client.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3 text-app-slate-400" />
                    <Link 
                      to={`/purchase-orders/${mockInvoice.poReference}`}
                      className="font-medium text-app-blue-600 hover:underline"
                    >
                      Purchase Order #{mockInvoice.poReference}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                  <div className="flex items-center">
                    <Receipt className="h-5 w-5 mr-3 text-app-slate-400" />
                    <span className="font-medium">Delivery Receipt</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
