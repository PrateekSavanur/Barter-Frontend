"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookie from "js-cookie";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Store user details
  loading: boolean; // Track authentication check status
  login: (response: { token: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookie.get("authToken");
      const user = Cookie.get("user");

      if (token && user) {
        setIsAuthenticated(true);
        setUser(JSON.parse(user));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false); // Authentication check is complete
    };

    checkAuth();
  }, []);

  const login = (response: { token: string; user: User }) => {
    const { token, user } = response;

    // Save token to cookies (set an expiration of 1 day, adjust as needed)
    Cookie.set("authToken", token, { expires: 1, path: "/" });
    Cookie.set("user", JSON.stringify(user), { expires: 1, path: "/" });

    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    Cookie.remove("authToken");
    Cookie.remove("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
