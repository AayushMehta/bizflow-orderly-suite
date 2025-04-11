
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Clients = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Clients</h1>
          <p className="text-app-slate-500">Manage your customer database</p>
        </div>
      </div>

      <div className="border border-dashed rounded-lg p-8 text-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-app-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-app-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-app-slate-900">Clients Module</h3>
          <p className="text-app-slate-500 max-w-md mx-auto">
            This page will show all your clients and allow you to manage their information,
            track order history, and analyze client relationships.
          </p>
          <div className="flex gap-3 mt-2">
            <Button asChild variant="outline">
              <Link to="/quotations">Create Quotation</Link>
            </Button>
            <Button asChild>
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
