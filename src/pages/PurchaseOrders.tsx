
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  FileText, 
  Plus, 
  Search, 
  CalendarRange 
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

// Mock purchase order data
const mockPurchaseOrders = [
  {
    id: "PO001",
    client: "Acme Corp",
    date: "2025-01-15",
    amount: 12500,
    status: "in-production",
    items: 5,
  },
  {
    id: "PO002",
    client: "Globex Industries",
    date: "2025-02-03",
    amount: 8750,
    status: "ready-for-delivery",
    items: 3,
  },
  {
    id: "PO003",
    client: "Stark Enterprises",
    date: "2025-03-07",
    amount: 22350,
    status: "delivered",
    items: 10,
  },
  {
    id: "PO004",
    client: "Wayne Industries",
    date: "2025-03-12",
    amount: 5680,
    status: "in-production",
    items: 2,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in-production":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">In Production</Badge>;
    case "ready-for-delivery":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Ready for Delivery</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(mockPurchaseOrders);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(mockPurchaseOrders);
    } else {
      const filtered = mockPurchaseOrders.filter(
        order => 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
          order.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Purchase Orders</h1>
          <p className="text-app-slate-500">Manage manufacturing and delivery process</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/quotations">
              <FileText className="mr-2 h-4 w-4" />
              Quotations
            </Link>
          </Button>
          <Button onClick={() => navigate("/purchase-orders/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search orders..." 
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
                <TableHead>PO ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/purchase-orders/${order.id}`}>
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

export default PurchaseOrders;
