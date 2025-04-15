
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash,
  Tag,
  DollarSign,
  FileText,
  Image
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Product categories
const productCategories = [
  "Electronics",
  "Office Supplies",
  "Furniture",
  "IT Equipment",
  "Services",
  "Other"
];

// Mock product data
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

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  unitPrice: number;
  unit: string;
  imageUrl: string;
}

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { hasPermission } = useUser();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    sku: "",
    category: "",
    description: "",
    unitPrice: 0,
    unit: "piece",
    imageUrl: "/placeholder.svg"
  });
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle adding a new product
  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
      );
      setProducts(updatedProducts);
      
      toast({
        title: "Product Updated",
        description: `${newProduct.name} has been updated in the catalog.`
      });
    } else {
      // Create new product
      const productId = `P${String(products.length + 1).padStart(3, '0')}`;
      const newProductWithId = { ...newProduct, id: productId };
      
      setProducts([...products, newProductWithId]);
      
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to the catalog.`
      });
    }
    
    setIsAddProductOpen(false);
    setEditingProduct(null);
    
    // Reset form
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      description: "",
      unitPrice: 0,
      unit: "piece",
      imageUrl: "/placeholder.svg"
    });
  };
  
  // Handle editing a product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description,
      unitPrice: product.unitPrice,
      unit: product.unit,
      imageUrl: product.imageUrl
    });
    setIsAddProductOpen(true);
  };
  
  // Handle deleting a product
  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    
    if (confirm(`Are you sure you want to delete ${productToDelete?.name}?`)) {
      setProducts(products.filter(p => p.id !== productId));
      
      toast({
        title: "Product Deleted",
        description: `${productToDelete?.name} has been removed from the catalog.`
      });
    }
  };
  
  // Reset form when dialog closes
  const handleDialogClose = () => {
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      description: "",
      unitPrice: 0,
      unit: "piece",
      imageUrl: "/placeholder.svg"
    });
    setEditingProduct(null);
  };
  
  // If user doesn't have permission, redirect to dashboard
  if (!hasPermission("view", "business")) {
    navigate("/dashboard");
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Product Catalog
          </h1>
          <p className="text-muted-foreground">
            Manage your products and services
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid")}>
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {hasPermission("create", "business") && (
            <Dialog 
              open={isAddProductOpen} 
              onOpenChange={(open) => {
                setIsAddProductOpen(open);
                if (!open) handleDialogClose();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct 
                      ? "Update the product details in your catalog." 
                      : "Add a new product to your catalog for use in quotations and orders."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Product Name*</label>
                      <Input 
                        id="name"
                        placeholder="Enter product name" 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="sku" className="text-sm font-medium">SKU*</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="sku"
                          placeholder="Enter SKU" 
                          className="pl-10"
                          value={newProduct.sku}
                          onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category*</label>
                      <Select 
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="unit" className="text-sm font-medium">Unit</label>
                      <Select 
                        value={newProduct.unit}
                        onValueChange={(value) => setNewProduct({...newProduct, unit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium">Unit Price*</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="price"
                        type="number"
                        placeholder="0.00" 
                        className="pl-10"
                        min="0"
                        step="0.01"
                        value={newProduct.unitPrice}
                        onChange={e => setNewProduct({
                          ...newProduct, 
                          unitPrice: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea 
                        id="description"
                        placeholder="Enter product description" 
                        className="pl-10 min-h-[80px]"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="image" className="text-sm font-medium">Product Image</label>
                    <div className="flex items-center gap-4">
                      <div className="border rounded-md p-2 h-20 w-20 flex items-center justify-center bg-muted">
                        <img 
                          src={newProduct.imageUrl || "/placeholder.svg"} 
                          alt="Product preview" 
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <Input 
                          id="image"
                          placeholder="Image URL" 
                          value={newProduct.imageUrl}
                          onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter image URL or use file upload in a real app
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveProduct}>
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search products..." 
          className="pl-10" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Fix: Wrap both TabsContent components within the main Tabs component */}
      <Tabs value={viewMode}>
        <TabsContent value="list" className="m-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  {hasPermission("edit", "business") && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={hasPermission("edit", "business") ? 6 : 5} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                      {hasPermission("edit", "business") && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      
        <TabsContent value="grid" className="m-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                No products found
              </div>
            ) : (
              filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{product.sku}</div>
                      <div className="text-base font-semibold mt-2">${product.unitPrice.toFixed(2)}</div>
                      
                      {hasPermission("edit", "business") && (
                        <div className="flex justify-end gap-2 pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductCatalog;
