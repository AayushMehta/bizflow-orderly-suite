
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Receipt, 
  ShoppingCart, 
  Plus, 
  Search, 
  CalendarRange,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock invoice data
const mockInvoices = [
  {
    id: "INV001",
    client: "Acme Corp",
    date: "2025-01-20",
    amount: 5800,
    status: "paid",
    poReference: "PO001",
  },
  {
    id: "INV002",
    client: "Globex Industries",
    date: "2025-02-10",
    amount: 3200,
    status: "pending",
    poReference: "PO002",
  },
  {
    id: "INV003",
    client: "Stark Enterprises",
    date: "2025-03-15",
    amount: 12500,
    status: "overdue",
    poReference: "PO003",
  },
  {
    id: "INV004",
    client: "Wayne Industries",
    date: "2025-03-25",
    amount: 8750,
    status: "paid",
    poReference: "PO004",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Paid</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
    case "overdue":
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInvoices(mockInvoices);
    } else {
      const filtered = mockInvoices.filter(
        invoice => 
          invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
          invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.poReference.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchQuery]);

  const handleAddInvoice = () => {
    navigate("/invoices/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Tax Invoices</h1>
          <p className="text-app-slate-500">Manage invoices and payment tracking</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/purchase-orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase Orders
            </Link>
          </Button>
          <Button onClick={handleAddInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarRange className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Link to={`/purchase-orders/${invoice.poReference}`} className="text-app-blue-600 hover:underline">
                      {invoice.poReference}
                    </Link>
                  </TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default Invoices;
