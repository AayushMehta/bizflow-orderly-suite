
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusinessSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Business Settings</h1>
          <p className="text-app-slate-500">Configure your business profile and preferences</p>
        </div>
      </div>

      <div className="border border-dashed rounded-lg p-8 text-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-app-blue-100 flex items-center justify-center">
            <Settings className="h-6 w-6 text-app-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-app-slate-900">Business Settings</h3>
          <p className="text-app-slate-500 max-w-md mx-auto">
            This page will allow you to configure your business information, tax settings,
            and application preferences for the current business.
          </p>
          <div className="flex gap-3 mt-2">
            <Button asChild variant="outline">
              <Link to="/select-business">Switch Business</Link>
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

export default BusinessSettings;
