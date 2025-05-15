
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "@/contexts/UserContext";
import AppLayout from '@/layouts/AppLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Quotations from '@/pages/Quotations';
import QuotationDetail from '@/pages/QuotationDetail';
import QuotationForm from '@/pages/QuotationForm';
import PurchaseOrders from '@/pages/PurchaseOrders';
import PurchaseOrderDetail from '@/pages/PurchaseOrderDetail';
import PurchaseOrderForm from '@/pages/PurchaseOrderForm';
import Invoices from '@/pages/Invoices';
import InvoiceDetail from '@/pages/InvoiceDetail';
import InvoiceForm from '@/pages/InvoiceForm';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import ClientForm from '@/pages/ClientForm';
import ProductCatalog from '@/pages/ProductCatalog';
import Profile from '@/pages/Profile';
import Teams from '@/pages/Teams';
import BusinessOnboarding from '@/pages/BusinessOnboarding';
import BusinessSelect from '@/pages/BusinessSelect';
import BusinessSettings from '@/pages/BusinessSettings';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/quotations/:id" element={<QuotationDetail />} />
              <Route path="/quotations/new" element={<QuotationForm />} />
              <Route path="/quotations/edit/:id" element={<QuotationForm />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="/purchase-orders/new" element={<PurchaseOrderForm />} />
              <Route path="/purchase-orders/edit/:id" element={<PurchaseOrderForm />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/invoices/new" element={<InvoiceForm />} />
              <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/edit/:id" element={<ClientForm />} />
              <Route path="/products" element={<ProductCatalog />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/business-onboarding" element={<BusinessOnboarding />} />
              <Route path="/select-business" element={<BusinessSelect />} />
              <Route path="/settings" element={<BusinessSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" closeButton richColors />
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
