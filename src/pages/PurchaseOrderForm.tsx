
import { useState, useEffect } from "react";
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
  ShoppingCart,
  DollarSign,
  Truck,
  MessageSquare
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { format } from "date-fns";
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

// Form validation schema
const purchaseOrderSchema = z.object({
  client: z.string().min(1, "Client is required"),
  orderDate: z.date(),
  deliveryDate: z.date(),
  shippingAddress: z.string().min(5, "Shipping address is required"),
  internalNotes: z.string().optional(),
  clientNotes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
    })
  ).min(1, "At least one item is required"),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if this PO is being created from a quotation
  const queryParams = new URLSearchParams(location.search);
  const fromQuotation = queryParams.get('from') === 'quotation';
  const quotationId = queryParams.get('id');
  
  // Default form values
  const defaultValues: PurchaseOrderFormValues = {
    client: "",
    orderDate: new Date(),
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    shippingAddress: "",
    internalNotes: "",
    clientNotes: "",
    taxRate: 8.5,
    items: [
      { description: "", quantity: 1, unitPrice: 0 }
    ]
  };
  
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues
  });
  
  // If created from quotation, fetch and populate data
  useEffect(() => {
    if (fromQuotation && quotationId) {
      // In a real app, you'd make an API call to fetch the quotation data
      // This is mock data for demonstration
      const mockQuotationData = {
        id: quotationId,
        client: "C001",
        items: [
          { description: "Custom Steel Brackets - 50mm", quantity: 100, unitPrice: 45.00 },
          { description: "Aluminum Panel Sheets - 4x8ft", quantity: 25, unitPrice: 180.00 },
          { description: "Installation Service - Per Hour", quantity: 20, unitPrice: 75.00 },
        ],
        taxRate: 8.5,
        notes: "This quotation includes installation services. Delivery within 3 weeks after order confirmation."
      };
      
      // Populate form with quotation data
      form.reset({
        ...defaultValues,
        client: mockQuotationData.client,
        taxRate: mockQuotationData.taxRate,
        items: mockQuotationData.items,
        clientNotes: mockQuotationData.notes
      });
      
      toast({
        title: "Quotation imported",
        description: `Data from quotation ${quotationId} has been imported.`
      });
    }
  }, [fromQuotation, quotationId, form, toast]);
  
  // Get item values from form
  const items = form.watch("items") || [];
  const taxRate = form.watch("taxRate") || 0;
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => 
    sum + (item.quantity || 0) * (item.unitPrice || 0), 0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
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
  
  // Handle form submission
  const onSubmit = (data: PurchaseOrderFormValues) => {
    console.log("Form submitted:", data);
    
    // In a real app, you'd make an API call here
    toast({
      title: "Purchase order created",
      description: "New purchase order has been successfully created."
    });
    
    navigate("/purchase-orders");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/purchase-orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-app-slate-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-app-blue-600" />
              New Purchase Order
            </h1>
            <p className="text-app-slate-500">
              {fromQuotation 
                ? `Creating a purchase order from quotation ${quotationId}` 
                : "Create a new purchase order for manufacturing"
              }
            </p>
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
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Select Client</FormLabel>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Select
                            onValueChange={field.onChange}
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="orderDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Date</FormLabel>
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
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Delivery Date</FormLabel>
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
                    name="shippingAddress"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Shipping Address</FormLabel>
                        <div className="relative">
                          <Truck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-[80px] pl-10"
                              placeholder="Enter shipping address"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Order Items</CardTitle>
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
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="internalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Notes (Not visible to client)</FormLabel>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Textarea
                              placeholder="Enter any notes for internal use..."
                              className="min-h-[100px] pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="clientNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes for Client</FormLabel>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Textarea
                              placeholder="Enter any notes for the client..."
                              className="min-h-[100px] pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This purchase order will be created with "In Production" status.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Create Purchase Order
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/purchase-orders")}>
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

export default PurchaseOrderForm;
