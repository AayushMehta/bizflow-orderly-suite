
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MoveLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-slate-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="h-24 w-24 rounded-full bg-app-blue-100 mx-auto flex items-center justify-center mb-6">
          <FileQuestion className="h-12 w-12 text-app-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-app-slate-900 mb-2">404</h1>
        <p className="text-xl text-app-slate-600 mb-6">Page not found</p>
        <p className="text-app-slate-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="gap-2">
            <Link to="/">
              <MoveLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
