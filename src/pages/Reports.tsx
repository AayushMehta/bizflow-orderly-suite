
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, ShoppingCart, Calendar, Download, Filter } from 'lucide-react';

// Mock data for reports
const financialData = [
  { month: 'Jan', revenue: 45000, expenses: 35000, profit: 10000 },
  { month: 'Feb', revenue: 52000, expenses: 38000, profit: 14000 },
  { month: 'Mar', revenue: 48000, expenses: 36000, profit: 12000 },
  { month: 'Apr', revenue: 61000, expenses: 42000, profit: 19000 },
  { month: 'May', revenue: 55000, expenses: 40000, profit: 15000 },
  { month: 'Jun', revenue: 67000, expenses: 45000, profit: 22000 },
];

const salesData = [
  { name: 'Electronics', value: 35, amount: 145000 },
  { name: 'Clothing', value: 25, amount: 89000 },
  { name: 'Home & Garden', value: 20, amount: 67000 },
  { name: 'Sports', value: 12, amount: 34000 },
  { name: 'Books', value: 8, amount: 23000 },
];

const clientData = [
  { month: 'Jan', new: 12, returning: 45, total: 57 },
  { month: 'Feb', new: 19, returning: 52, total: 71 },
  { month: 'Mar', new: 15, returning: 48, total: 63 },
  { month: 'Apr', new: 22, returning: 58, total: 80 },
  { month: 'May', new: 18, returning: 55, total: 73 },
  { month: 'Jun', new: 25, returning: 62, total: 87 },
];

const performanceMetrics = [
  { title: 'Total Revenue', value: '$328,000', change: '+12.5%', trend: 'up', color: 'text-green-600' },
  { title: 'Active Clients', value: '234', change: '+8.2%', trend: 'up', color: 'text-green-600' },
  { title: 'Pending Orders', value: '18', change: '-15.3%', trend: 'down', color: 'text-red-600' },
  { title: 'Avg Order Value', value: '$1,402', change: '+5.7%', trend: 'up', color: 'text-green-600' },
];

const recentTransactions = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$12,500', status: 'paid', date: '2024-01-15' },
  { id: 'INV-002', client: 'Tech Solutions', amount: '$8,900', status: 'pending', date: '2024-01-14' },
  { id: 'INV-003', client: 'Global Industries', amount: '$15,200', status: 'paid', date: '2024-01-13' },
  { id: 'INV-004', client: 'StartUp Inc', amount: '$3,400', status: 'overdue', date: '2024-01-10' },
  { id: 'INV-005', client: 'Enterprise LLC', amount: '$22,100', status: 'paid', date: '2024-01-09' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const chartConfig = {
    revenue: { label: 'Revenue', color: '#3b82f6' },
    expenses: { label: 'Expenses', color: '#ef4444' },
    profit: { label: 'Profit', color: '#10b981' },
  };

  return (
    <div className="mobile-container space-y-6 pb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="app-title">Business Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive business analytics and insights</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="touch-target flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="touch-target flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="mobile-card">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground truncate">{metric.title}</p>
                  <p className="text-lg md:text-xl font-bold">{metric.value}</p>
                  <div className={`flex items-center gap-1 ${metric.color}`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{metric.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="mobile-tabs w-full justify-start">
          <TabsTrigger value="financial" className="mobile-tab">Financial</TabsTrigger>
          <TabsTrigger value="sales" className="mobile-tab">Sales</TabsTrigger>
          <TabsTrigger value="clients" className="mobile-tab">Clients</TabsTrigger>
          <TabsTrigger value="operations" className="mobile-tab">Operations</TabsTrigger>
        </TabsList>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-4 mt-4">
          <Card className="mobile-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Financial Overview</CardTitle>
              <CardDescription>Revenue, expenses, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="2" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-base">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle className="text-base">Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Inflow</span>
                  <span className="font-semibold text-green-600">$328,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Outflow</span>
                  <span className="font-semibold text-red-600">$236,000</span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-sm font-medium">Net Cash Flow</span>
                  <span className="font-bold text-green-600">$92,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Reports */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="text-lg">Sales by Category</CardTitle>
              <CardDescription>Product category performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Category Performance</h3>
            {salesData.map((category, index) => (
              <Card key={index} className="mobile-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${category.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{category.value}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Client Reports */}
        <TabsContent value="clients" className="space-y-4 mt-4">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="text-lg">Client Growth</CardTitle>
              <CardDescription>New vs returning clients over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="new" fill="#3b82f6" name="New Clients" />
                    <Bar dataKey="returning" fill="#10b981" name="Returning Clients" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">234</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">New This Month</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">$1,402</p>
                <p className="text-sm text-muted-foreground">Avg Lifetime Value</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Reports */}
        <TabsContent value="operations" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Quotations</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Invoices</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>Latest invoice and payment activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="mobile-list-item rounded-lg border p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{transaction.client}</span>
                      <span className="font-semibold">{transaction.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{transaction.id}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            transaction.status === 'paid' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
