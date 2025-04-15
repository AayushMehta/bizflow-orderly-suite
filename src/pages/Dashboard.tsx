import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  FileText,
  Receipt,
  Clock,
  AlertTriangle,
  Upload,
  FileUp
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("month");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  
  useEffect(() => {
    const businessData = localStorage.getItem("selectedBusiness");
    if (businessData) {
      setSelectedBusiness(JSON.parse(businessData));
    }
  }, []);
  
  // Mock function to handle document upload
  const handleDocumentUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      toast({
        title: "Document uploaded",
        description: `Successfully uploaded ${files.length} document(s).`
      });
      
      // In a real app, this would update the business's pending documents count
      const updatedBusiness = { ...selectedBusiness, pendingDocuments: Math.max(0, selectedBusiness.pendingDocuments - files.length) };
      localStorage.setItem("selectedBusiness", JSON.stringify(updatedBusiness));
      setSelectedBusiness(updatedBusiness);
    }
  };
  
  // Mock data for financial metrics
  const financialSummary = {
    revenue: 125645.50,
    expenses: 78950.75,
    profit: 46694.75,
    profitMargin: 37.2
  };
  
  // Mock data for orders
  const orders = {
    quotations: 23,
    pendingQuotations: 8,
    purchaseOrders: 18,
    pendingDeliveries: 7,
    invoices: 15,
    pendingPayments: 5
  };
  
  // Mock data for recent activity
  const recentActivity = [
    { id: 1, type: "quotation", number: "QT-2025-042", client: "Acme Corp", amount: 12500, status: "Pending Approval", date: "2025-04-08" },
    { id: 2, type: "purchase_order", number: "PO-2025-038", client: "Smith Manufacturing", amount: 8750, status: "In Production", date: "2025-04-07" },
    { id: 3, type: "invoice", number: "INV-2025-029", client: "Global Industries", amount: 15200, status: "Paid", date: "2025-04-05" },
    { id: 4, type: "purchase_order", number: "PO-2025-036", client: "TechSolutions Inc", amount: 22400, status: "Ready for Delivery", date: "2025-04-04" },
    { id: 5, type: "invoice", number: "INV-2025-027", client: "Innovative Systems", amount: 9850, status: "Overdue", date: "2025-04-02" },
  ];
  
  // Mock chart data
  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 34000, profit: 18000 },
    { month: "Mar", revenue: 48000, expenses: 36000, profit: 12000 },
    { month: "Apr", revenue: 61000, expenses: 40000, profit: 21000 },
    { month: "May", revenue: 55000, expenses: 39000, profit: 16000 },
    { month: "Jun", revenue: 67000, expenses: 42000, profit: 25000 },
    { month: "Jul", revenue: 72000, expenses: 45000, profit: 27000 },
    { month: "Aug", revenue: 69000, expenses: 43000, profit: 26000 },
    { month: "Sep", revenue: 75000, expenses: 47000, profit: 28000 },
    { month: "Oct", revenue: 82000, expenses: 49000, profit: 33000 },
    { month: "Nov", revenue: 87000, expenses: 52000, profit: 35000 },
    { month: "Dec", revenue: 92000, expenses: 55000, profit: 37000 },
  ];
  
  const orderTypeData = [
    { name: "Manufacturing", value: 45 },
    { name: "Services", value: 30 },
    { name: "Supplies", value: 15 },
    { name: "Consulting", value: 10 },
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quotation": 
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "purchase_order": 
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "invoice": 
        return <Receipt className="h-4 w-4 text-purple-500" />;
      default: 
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getActivityLink = (type: string, id: number) => {
    switch (type) {
      case "quotation": 
        return `/quotations/${id}`;
      case "purchase_order": 
        return `/purchase-orders/${id}`;
      case "invoice": 
        return `/invoices/${id}`;
      default: 
        return "#";
    }
  };
  
  const getStatusColor = (status: string) => {
    if (status.includes("Paid") || status.includes("Approved") || status.includes("Ready")) {
      return "text-green-600 bg-green-50";
    } else if (status.includes("Pending")) {
      return "text-yellow-600 bg-yellow-50";
    } else if (status.includes("Overdue") || status.includes("Cancelled")) {
      return "text-red-600 bg-red-50";
    } else {
      return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold text-app-slate-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {selectedBusiness?.pendingDocuments > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100">
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload Pending Documents
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Upload Business Documents</SheetTitle>
                  <SheetDescription>
                    Upload the required documents for your business verification.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-dashed border-app-slate-300 p-10 text-center">
                      <Upload className="h-10 w-10 text-app-slate-400 mx-auto mb-4" />
                      <h3 className="text-app-slate-800 font-medium mb-2">Upload Documents</h3>
                      <p className="text-app-slate-500 text-sm mb-4">
                        Drag and drop files here, or click to browse
                      </p>
                      <input
                        type="file"
                        id="document-upload"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDocumentUpload(e.target.files)}
                      />
                      <label htmlFor="document-upload">
                        <Button type="button" variant="outline" className="mt-2">
                          Select Files
                        </Button>
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-app-slate-800">Required Documents:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-app-slate-600">
                        <li>Business registration certificate</li>
                        <li>Tax identification documents</li>
                        <li>Business address proof</li>
                        <li>Owner identification proof</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Tabs defaultValue="month" className="space-y-4" onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-app-slate-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${financialSummary.revenue.toLocaleString()}</div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">12.5%</span>
              <span className="text-app-slate-500 ml-1">vs. last {timeframe}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-app-slate-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${financialSummary.expenses.toLocaleString()}</div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">5.2%</span>
              <span className="text-app-slate-500 ml-1">vs. last {timeframe}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-app-slate-500">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${financialSummary.profit.toLocaleString()}</div>
              <div className="h-8 w-8 rounded-full bg-app-blue-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-app-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">8.7%</span>
              <span className="text-app-slate-500 ml-1">vs. last {timeframe}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-app-slate-500">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{financialSummary.profitMargin}%</div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <Progress value={financialSummary.profitMargin} className="mt-2 h-2" />
            <div className="flex items-center mt-2 text-sm">
              <span className="text-app-slate-500">Target: 40%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Profit</CardTitle>
            <CardDescription>Financial performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f670"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef444470"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b98170"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
            <CardDescription>By product/service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-app-slate-500">Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.quotations}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-app-slate-500">
                  <span className="text-yellow-600 font-medium">{orders.pendingQuotations}</span> pending
                </div>
                <Link to="/quotations">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-app-slate-500">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.purchaseOrders}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-app-slate-500">
                  <span className="text-blue-600 font-medium">{orders.pendingDeliveries}</span> in progress
                </div>
                <Link to="/purchase-orders">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-app-slate-500">Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.invoices}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-app-slate-500">
                  <span className="text-red-600 font-medium">{orders.pendingPayments}</span> unpaid
                </div>
                <Link to="/invoices">
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="h-8 w-8 rounded-full bg-app-slate-100 flex items-center justify-center mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Link 
                        to={getActivityLink(activity.type, activity.id)}
                        className="font-medium text-app-slate-900 hover:text-app-blue-600"
                      >
                        {activity.number}
                      </Link>
                      <span className="text-sm text-app-slate-500">{activity.date}</span>
                    </div>
                    <div className="text-sm text-app-slate-600">{activity.client}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">${activity.amount.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm font-medium text-yellow-700">5 invoices overdue</p>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium text-blue-700">3 quotations expiring soon</p>
                </div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-red-500" />
                  <p className="text-sm font-medium text-red-700">2 orders delayed in production</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
