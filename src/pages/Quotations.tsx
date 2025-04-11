
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Quotation {
  id: string;
  number: string;
  client: { id: string; name: string };
  date: string;
  validUntil: string;
  amount: number;
  status: string;
}

const Quotations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock quotations data
  const quotations: Quotation[] = [
    { 
      id: "1", 
      number: "QT-2025-045", 
      client: { id: "C001", name: "Acme Corp" }, 
      date: "2025-04-10", 
      validUntil: "2025-05-10", 
      amount: 12500, 
      status: "Pending Approval" 
    },
    { 
      id: "2", 
      number: "QT-2025-044", 
      client: { id: "C003", name: "TechSolutions Inc" }, 
      date: "2025-04-09", 
      validUntil: "2025-05-09", 
      amount: 22400, 
      status: "Draft" 
    },
    { 
      id: "3", 
      number: "QT-2025-043", 
      client: { id: "C002", name: "Smith Manufacturing" }, 
      date: "2025-04-08", 
      validUntil: "2025-05-08", 
      amount: 8750, 
      status: "Approved" 
    },
    { 
      id: "4", 
      number: "QT-2025-042", 
      client: { id: "C005", name: "Global Industries" }, 
      date: "2025-04-07", 
      validUntil: "2025-05-07", 
      amount: 15200, 
      status: "Approved" 
    },
    { 
      id: "5", 
      number: "QT-2025-041", 
      client: { id: "C004", name: "Innovative Systems" }, 
      date: "2025-04-06", 
      validUntil: "2025-05-06", 
      amount: 9850, 
      status: "Rejected" 
    },
    { 
      id: "6", 
      number: "QT-2025-040", 
      client: { id: "C001", name: "Acme Corp" }, 
      date: "2025-04-05", 
      validUntil: "2025-05-05", 
      amount: 6200, 
      status: "Expired" 
    },
    { 
      id: "7", 
      number: "QT-2025-039", 
      client: { id: "C006", name: "First Choice Builders" }, 
      date: "2025-04-04", 
      validUntil: "2025-05-04", 
      amount: 18600, 
      status: "Approved" 
    },
  ];
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Pending Approval":
        return "text-yellow-600 bg-yellow-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      case "Expired":
        return "text-gray-600 bg-gray-50";
      case "Draft":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  
  // Filter and sort quotations
  let filteredQuotations = [...quotations];
  
  if (statusFilter !== "all") {
    filteredQuotations = filteredQuotations.filter(q => q.status === statusFilter);
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredQuotations = filteredQuotations.filter(q => 
      q.number.toLowerCase().includes(term) || 
      q.client.name.toLowerCase().includes(term)
    );
  }
  
  filteredQuotations.sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "number":
        comparison = a.number.localeCompare(b.number);
        break;
      case "client":
        comparison = a.client.name.localeCompare(b.client.name);
        break;
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "validUntil":
        comparison = new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Quotations</h1>
          <p className="text-app-slate-500">Manage and track client quotations</p>
        </div>
        <Button onClick={() => navigate("/quotations/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Quotation
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search quotations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select 
            defaultValue="all"
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("number")}
              >
                <div className="flex items-center space-x-1">
                  <span>Quotation #</span>
                  {getSortIcon("number")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("client")}
              >
                <div className="flex items-center space-x-1">
                  <span>Client</span>
                  {getSortIcon("client")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("validUntil")}
              >
                <div className="flex items-center space-x-1">
                  <span>Valid Until</span>
                  {getSortIcon("validUntil")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Amount</span>
                  {getSortIcon("amount")}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No quotations found. Try adjusting your filters or create a new quotation.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotations.map((quotation) => (
                <TableRow 
                  key={quotation.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/quotations/${quotation.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-app-blue-500 mr-2" />
                      {quotation.number}
                    </div>
                  </TableCell>
                  <TableCell>{quotation.client.name}</TableCell>
                  <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${quotation.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/quotations/${quotation.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/quotations/${quotation.id}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        <DropdownMenuItem>Email to Client</DropdownMenuItem>
                        {quotation.status === "Approved" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Convert to Purchase Order</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Quotations;
