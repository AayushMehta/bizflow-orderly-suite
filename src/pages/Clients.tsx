
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Plus, 
  Search,
  Mail,
  Phone
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

// Mock client data
const mockClients = [
  {
    id: "CL001",
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    orders: 12,
  },
  {
    id: "CL002",
    name: "Globex Industries",
    contact: "Sarah Johnson",
    email: "sarah@globex.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    orders: 8,
  },
  {
    id: "CL003",
    name: "Stark Enterprises",
    contact: "Tony Stark",
    email: "tony@stark.com",
    phone: "+1 (555) 111-2222",
    status: "inactive",
    orders: 5,
  },
  {
    id: "CL004",
    name: "Wayne Industries",
    contact: "Bruce Wayne",
    email: "bruce@wayne.com",
    phone: "+1 (555) 333-4444",
    status: "active",
    orders: 15,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
    case "inactive":
      return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Inactive</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(mockClients);
    } else {
      const filtered = mockClients.filter(
        client => 
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery]);

  const handleAddClient = () => {
    navigate("/clients/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Clients</h1>
          <p className="text-app-slate-500">Manage your customer database</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/quotations">
              <FileText className="mr-2 h-4 w-4" />
              Create Quotation
            </Link>
          </Button>
          <Button onClick={handleAddClient}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search clients..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                  <TableCell>
                    <a href={`mailto:${client.email}`} className="flex items-center text-app-blue-600 hover:underline">
                      <Mail className="h-4 w-4 mr-1" />
                      {client.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${client.phone}`} className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {client.phone}
                    </a>
                  </TableCell>
                  <TableCell>{client.orders}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/clients/${client.id}`}>
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

export default Clients;
