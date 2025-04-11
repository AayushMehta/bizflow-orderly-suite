
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    
    if (user) {
      // Check if business is selected
      const business = localStorage.getItem("selectedBusiness");
      if (business) {
        // User is logged in and has selected a business, show dashboard
        navigate("/");
      } else {
        // User is logged in but needs to select a business
        navigate("/select-business");
      }
    } else {
      // User is not logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">BizFlow</h1>
        <p className="text-gray-500 mt-2">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
