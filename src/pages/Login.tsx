
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to BizFlow.",
        });
        
        navigate("/select-business");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md border border-app-slate-200">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="h-12 w-12 bg-app-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-app-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-app-slate-900">BizFlow</h1>
            <p className="text-app-slate-500 mt-1">Accounting & Manufacturing</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-app-slate-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-app-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-app-blue-600 hover:text-app-blue-500">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-app-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-app-blue-600 hover:text-app-blue-500">
                Register now
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-app-slate-200">
            <div className="flex flex-col items-center text-sm text-app-slate-500 space-y-2">
              <div className="flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                <span>Demo credentials:</span>
              </div>
              <ul className="text-left w-full max-w-xs space-y-1">
                <li><strong>Admin:</strong> admin@example.com / password</li>
                <li><strong>Partner:</strong> partner@example.com / password</li>
                <li><strong>Data Entry:</strong> dataentry@example.com / password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
