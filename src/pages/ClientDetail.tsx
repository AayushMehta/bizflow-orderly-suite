
import { useParams, Link } from "react-router-dom";
import { User } from "lucide-react";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-app-slate-900">Client Detail</h1>
          <p className="text-app-slate-500">ID: {id}</p>
        </div>
      </div>

      <div className="border border-dashed rounded-lg p-8 text-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-app-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-app-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-app-slate-900">Client Profile</h3>
          <p className="text-app-slate-500 max-w-md mx-auto">
            This page will display detailed client information, including contact details,
            order history, and financial relationship data.
          </p>
          <div className="flex gap-3 mt-2">
            <Link to="/clients" className="text-app-blue-600 hover:text-app-blue-800">
              Back to Clients
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
