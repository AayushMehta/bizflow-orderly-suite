
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  Save, 
  Trash, 
  Plus,
  Calendar,
  Building,
  FileText,
  DollarSign,
  CreditCard,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Mock clients data
const mockClients = [
  { id: "C001", name: "Acme Corp", taxId: "TAX-12345678" },
  { id: "C002", name: "Smith Manufacturing", taxId: "TAX-87654321" },
  { id: "C003", name: "TechSolutions Inc", taxId: "TAX-23456789" },
  { id: "C004", name: "Innovative Systems", taxId: "TAX-34567890" },
  { id: "C005", name: "Global Industries", taxId: "TAX-45678901" },
  { id: "C006", name: "First Choice Builders", taxId: "TAX-56789012" },
];

// Mock purchase orders
const mockPurchaseOrders = [
  { id: "PO001", client: "C001", amount: 12500 },
  { id: "PO002", client: "C002", amount: 8750 },
  { id: "PO003", client: "C003", amount: 22350 },
  { id: "PO004", client: "C001", amount: 5680 },
];

// Form validation schema
const invoiceSchema = z.object({
  client: z.string().min(1, "Client is required"),
  purchaseOrder: z.string().optional(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
    })
  ).min(1, "At least one item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Default form values
  const defaultValues: InvoiceFormValues = {
    client: "",
    purchaseOrder: "",
    invoiceDate: new Date(),
    dueDate: addDays(new Date(), 30),
    paymentTerms: "net30",
    notes: "",
    taxRate: 8.5,
    items: [
      { description: "", quantity: 1, unitPrice: 0 }
    ]
  };
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues
  });
  
  // Get item values from form
  const items = form.watch("items") || [];
  const taxRate = form.watch("taxRate") || 0;
  const selectedClient = form.watch("client");
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => 
    sum + (item.quantity || 0) * (item.unitPrice || 0), 0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  // Filter purchase orders by selected client
  const filteredPurchaseOrders = mockPurchaseOrders.filter(
    po => po.client === selectedClient
  );
  
  // Handle add item
  const handleAddItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      { description: "", quantity: 1, unitPrice: 0 }
    ]);
  };
  
  // Handle remove item
  const handleRemoveItem = (index: number) => {
    const currentItems = form.getValues("items") || [];
    if (currentItems.length <= 1) return; // Don't remove the last item
    
    form.setValue("items", currentItems.filter((_, i) => i !== index));
  };
  
  // Handle client change
  const handleClientChange = (value: string) => {
    form.setValue("client", value);
    form.setValue("purchaseOrder", ""); // Reset PO when client changes
  };
  
  // Handle purchase order selection
  const handlePurchaseOrderChange = (poId: string) => {
    form.setValue("purchaseOrder", poId);
    
    // In a real app, you'd fetch the purchase order details and populate items
    const mockItems = [
      { description: "Custom Steel Brackets - 50mm", quantity: 100, unitPrice: 45.00 },
      { description: "Aluminum Panel Sheets - 4x8ft", quantity: 25, unitPrice: 180.00 },
    ];
    
    form.setValue("items", mockItems);
  };
  
  // Handle form submission
  const onSubmit = (data: InvoiceFormValues) => {
    console.log("Form submitted:", data);
    
    // In a real app, you'd make an API call here
    toast({
      title: "Invoice created",
      description: "New invoice has been successfully created."
    });
    
    navigate("/invoices");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-app-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-app-blue-600" />
              New Invoice
            </h1>
            <p className="text-app-slate-500">Create a new invoice for a client</p>
          </div>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Client</FormLabel>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Select
                              onValueChange={handleClientChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockClients.map((client) => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="purchaseOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Purchase Order</FormLabel>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Select
                              onValueChange={handlePurchaseOrderChange}
                              defaultValue={field.value}
                              disabled={!selectedClient}
                            >
                              <FormControl>
                                <SelectTrigger className="pl-10">
                                  <SelectValue placeholder={selectedClient ? "Select a purchase order" : "Select a client first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None (Create standalone invoice)</SelectItem>
                                {filteredPurchaseOrders.map((po) => (
                                  <SelectItem key={po.id} value={po.id}>
                                    {po.id} - ${po.amount.toLocaleString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="invoiceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Date</FormLabel>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="pl-10 w-full justify-start text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="pl-10 w-full justify-start text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Payment Terms</FormLabel>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Select payment terms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="immediate">Due Immediately</SelectItem>
                              <SelectItem value="net15">Net 15 Days</SelectItem>
                              <SelectItem value="net30">Net 30 Days</SelectItem>
                              <SelectItem value="net45">Net 45 Days</SelectItem>
                              <SelectItem value="net60">Net 60 Days</SelectItem>
                              <SelectItem value="eom">End of Month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Invoice Items</CardTitle>
                  <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.description`)}
                              placeholder="Item description"
                            />
                            {form.formState.errors.items?.[index]?.description && (
                              <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.items[index]?.description?.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                              type="number"
                              min="1"
                            />
                            {form.formState.errors.items?.[index]?.quantity && (
                              <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.items[index]?.quantity?.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                type="number"
                                min="0"
                                step="0.01"
                                className="pl-10"
                              />
                            </div>
                            {form.formState.errors.items?.[index]?.unitPrice && (
                              <p className="text-xs text-red-500 mt-1">
                                {form.formState.errors.items[index]?.unitPrice?.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              disabled={items.length <= 1}
                            >
                              <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-app-slate-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-app-slate-600">Tax Rate</span>
                        <div className="w-20">
                          <Input
                            {...form.register("taxRate", { valueAsNumber: true })}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <span>%</span>
                      </div>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes or payment instructions..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <CreditCard className="h-4 w-4 text-app-slate-600" />
                      <span>Payment Methods</span>
                    </div>
                    <p className="text-sm text-app-slate-600">
                      Bank Transfer, Credit Card, PayPal
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Clock className="h-4 w-4 text-app-slate-600" />
                      <span>Due Date</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-app-slate-600">
                        {form.watch("dueDate") ? format(form.watch("dueDate"), "PPP") : "Not set"}
                      </p>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {form.watch("paymentTerms") === "immediate" ? "Due Immediately" : 
                          form.watch("paymentTerms") === "net15" ? "Net 15" :
                          form.watch("paymentTerms") === "net30" ? "Net 30" :
                          form.watch("paymentTerms") === "net45" ? "Net 45" :
                          form.watch("paymentTerms") === "net60" ? "Net 60" : "End of Month"
                        }
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/invoices")}>
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;
