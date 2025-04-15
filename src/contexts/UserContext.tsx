
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// User role types
export type UserRole = "admin" | "partner" | "data-entry";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businesses: string[]; // IDs of businesses the user has access to
}

// Context state interface
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: "view" | "edit" | "create" | "delete", resourceType: string) => boolean;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin" as UserRole,
    businesses: ["NYC001", "LA002", "CHI003"] // Admin has access to all businesses
  },
  {
    id: "2",
    email: "partner@example.com",
    password: "password",
    name: "Partner User",
    role: "partner" as UserRole,
    businesses: ["NYC001", "LA002"] // Partner has access to some businesses
  },
  {
    id: "3",
    email: "dataentry@example.com",
    password: "password",
    name: "Data Entry User",
    role: "data-entry" as UserRole,
    businesses: ["NYC001"] // Data entry has limited access
  }
];

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Find user in mock data (in a real app, this would be an API call)
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Create a user object without the password
      const { password, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedBusiness");
    setUser(null);
    navigate("/login");
  };

  // Permission check based on user role
  const hasPermission = (permission: "view" | "edit" | "create" | "delete", resourceType: string): boolean => {
    if (!user) return false;

    // Define permissions for each role
    const rolePermissions = {
      "admin": {
        view: ["business", "quotation", "purchase-order", "invoice", "client", "user", "report"],
        edit: ["business", "quotation", "purchase-order", "invoice", "client", "user", "report"],
        create: ["business", "quotation", "purchase-order", "invoice", "client", "user", "report"],
        delete: ["business", "quotation", "purchase-order", "invoice", "client", "user", "report"]
      },
      "partner": {
        view: ["business", "quotation", "purchase-order", "invoice", "client", "report"],
        edit: ["quotation", "purchase-order", "invoice"],
        create: ["quotation", "purchase-order", "invoice"],
        delete: []
      },
      "data-entry": {
        view: ["business", "quotation", "purchase-order", "invoice", "client"],
        edit: ["quotation", "purchase-order", "invoice", "client"],
        create: ["quotation", "purchase-order", "invoice", "client"],
        delete: []
      }
    };

    // Check if the role has the required permission for the resource type
    return rolePermissions[user.role][permission].includes(resourceType);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    isLoading,
    hasPermission
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
