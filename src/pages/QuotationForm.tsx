
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Package,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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

// Mock products data
const mockProducts = [
  {
    id: "P001",
    name: "Laptop Computer",
    sku: "LAP-001",
    category: "Electronics",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    unitPrice: 1299.99,
    unit: "piece",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "P002",
    name: "Office Desk",
    sku: "DSK-001",
    category: "Furniture",
    description: "Adjustable height desk with steel frame",
    unitPrice: 399.99,
    unit: "piece",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "P003",
    name: "Wireless Mouse",
    sku: "MOU-001",
    category: "Electronics",
    description: "Ergonomic wireless mouse with long battery life",
    unitPrice: 29.99,
    unit: "piece",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "P004",
    name: "IT Support - Basic",
    sku: "SRV-001",
    category: "Services",
    description: "Basic IT support package, 5 hours",
    unitPrice: 250.00,
    unit: "service",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "P005",
    name: "Premium Paper",
    sku: "PAP-001",
    category: "Office Supplies",
    description: "Premium A4 paper, 500 sheets",
    unitPrice: 12.99,
    unit: "pack",
    imageUrl: "/placeholder.svg"
  }
];

// Form validation schema
const quotationSchema = z.object({
  client: z.string().min(1, "Client is required"),
  date: z.date(),
  validUntil: z.date(),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      description: z.string().min(1, "Description is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
    })
  ).min(1, "At least one item is required"),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

const QuotationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for product selection dialog
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter products based on search query
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Default form values
  const defaultValues: QuotationFormValues = {
    client: "",
    date: new Date(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)),
    notes: "",
    taxRate: 8.5,
    items: [
      { productId: "", description: "", quantity: 1, unitPrice: 0 }
    ]
  };
  
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues
  });
  
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
      { productId: "", description: "", quantity: 1, unitPrice: 0 }
    ]);
  };
  
  // Handle remove item
  const handleRemoveItem = (index: number) => {
    const currentItems = form.getValues("items") || [];
    if (currentItems.length <= 1) return; // Don't remove the last item
    
    form.setValue("items", currentItems.filter((_, i) => i !== index));
  };
  
  // Open product selection dialog
  const openProductDialog = (index: number) => {
    setCurrentItemIndex(index);
    setIsProductDialogOpen(true);
    setSearchQuery("");
  };
  
  // Handle product selection
  const handleSelectProduct = (product: typeof mockProducts[0]) => {
    if (currentItemIndex === null) return;
    
    const currentItems = form.getValues("items");
    
    // Update the item with product details
    currentItems[currentItemIndex] = {
      ...currentItems[currentItemIndex],
      productId: product.id,
      description: product.name + (product.description ? ` - ${product.description}` : ""),
      unitPrice: product.unitPrice
    };
    
    form.setValue("items", currentItems);
    setIsProductDialogOpen(false);
    setCurrentItemIndex(null);
  };
  
  // Handle form submission
  const onSubmit = (data: QuotationFormValues) => {
    console.log("Form submitted:", data);
    
    // In a real app, you'd make an API call here
    toast({
      title: "Quotation created",
      description: "New quotation has been successfully created."
    });
    
    navigate("/quotations");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/quotations")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-app-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-app-blue-600" />
              New Quotation
            </h1>
            <p className="text-app-slate-500">Create a new quotation for a client</p>
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
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quotation Date</FormLabel>
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
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Until</FormLabel>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Quotation Items</CardTitle>
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
                            <div className="space-y-1">
                              <div className="flex gap-2">
                                <Input
                                  {...form.register(`items.${index}.description`)}
                                  placeholder="Item description"
                                  className="flex-1"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="h-10 px-3"
                                  onClick={() => openProductDialog(index)}
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                              </div>
                              {form.formState.errors.items?.[index]?.description && (
                                <p className="text-xs text-red-500">
                                  {form.formState.errors.items[index]?.description?.message}
                                </p>
                              )}
                            </div>
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
                            placeholder="Enter any additional notes, terms, or conditions..."
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
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This quotation will be created as a draft. You can review it before sending to the client.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Create Quotation
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/quotations")}>
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      
      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
            <DialogDescription>
              Choose a product from your catalog to add to the quotation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative my-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectProduct(product)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationForm;
