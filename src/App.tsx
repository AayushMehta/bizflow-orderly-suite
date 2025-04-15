
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider, useUser } from "./contexts/UserContext";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import BusinessSelect from "./pages/BusinessSelect";
import Quotations from "./pages/Quotations";
import QuotationDetail from "./pages/QuotationDetail";
import QuotationForm from "./pages/QuotationForm";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseOrderDetail from "./pages/PurchaseOrderDetail";
import PurchaseOrderForm from "./pages/PurchaseOrderForm";
import Invoices from "./pages/Invoices";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceForm from "./pages/InvoiceForm";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientForm from "./pages/ClientForm";
import BusinessSettings from "./pages/BusinessSettings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredPermission, resourceType }: { 
  children: React.ReactNode, 
  requiredPermission?: "view" | "edit" | "create" | "delete",
  resourceType?: string
}) => {
  const { user, isLoading, hasPermission } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If permission check is required and user doesn't have permission
  if (requiredPermission && resourceType && !hasPermission(requiredPermission, resourceType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App with UserProvider
const AppWithProvider = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/select-business" element={
              <ProtectedRoute>
                <BusinessSelect />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="quotations" element={
                <ProtectedRoute requiredPermission="view" resourceType="quotation">
                  <Quotations />
                </ProtectedRoute>
              } />
              <Route path="quotations/new" element={
                <ProtectedRoute requiredPermission="create" resourceType="quotation">
                  <QuotationForm />
                </ProtectedRoute>
              } />
              <Route path="quotations/:id" element={
                <ProtectedRoute requiredPermission="view" resourceType="quotation">
                  <QuotationDetail />
                </ProtectedRoute>
              } />
              <Route path="purchase-orders" element={
                <ProtectedRoute requiredPermission="view" resourceType="purchase-order">
                  <PurchaseOrders />
                </ProtectedRoute>
              } />
              <Route path="purchase-orders/new" element={
                <ProtectedRoute requiredPermission="create" resourceType="purchase-order">
                  <PurchaseOrderForm />
                </ProtectedRoute>
              } />
              <Route path="purchase-orders/:id" element={
                <ProtectedRoute requiredPermission="view" resourceType="purchase-order">
                  <PurchaseOrderDetail />
                </ProtectedRoute>
              } />
              <Route path="invoices" element={
                <ProtectedRoute requiredPermission="view" resourceType="invoice">
                  <Invoices />
                </ProtectedRoute>
              } />
              <Route path="invoices/new" element={
                <ProtectedRoute requiredPermission="create" resourceType="invoice">
                  <InvoiceForm />
                </ProtectedRoute>
              } />
              <Route path="invoices/:id" element={
                <ProtectedRoute requiredPermission="view" resourceType="invoice">
                  <InvoiceDetail />
                </ProtectedRoute>
              } />
              <Route path="clients" element={
                <ProtectedRoute requiredPermission="view" resourceType="client">
                  <Clients />
                </ProtectedRoute>
              } />
              <Route path="clients/new" element={
                <ProtectedRoute requiredPermission="create" resourceType="client">
                  <ClientForm />
                </ProtectedRoute>
              } />
              <Route path="clients/:id" element={
                <ProtectedRoute requiredPermission="view" resourceType="client">
                  <ClientDetail />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredPermission="view" resourceType="business">
                  <BusinessSettings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const App = () => <AppWithProvider />;

export default App;
