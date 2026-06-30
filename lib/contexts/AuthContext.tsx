"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type AuthUser = {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role?: "user" | "admin";
  status?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (userData: AuthUser | null) => {
    setUserState(userData);

    if (typeof window === "undefined") return;

    if (!userData) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminToken");
      return;
    }

    if (userData.role === "admin") {
      sessionStorage.setItem("adminUser", JSON.stringify(userData));
    } else {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  useEffect(() => {
    const loadStoredUser = () => {
      try {
        setLoading(true);

        const isAdminRoute = pathname?.startsWith("/admin");

        if (isAdminRoute) {
          const adminToken = sessionStorage.getItem("adminToken");
          const adminUser = sessionStorage.getItem("adminUser");

          if (adminToken && adminUser) {
            const parsedAdmin = JSON.parse(adminUser);

            if (parsedAdmin?.role === "admin") {
              setUserState(parsedAdmin);
              return;
            }
          }

          setUserState(null);
          return;
        }

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);

          if (parsedUser?.role !== "admin") {
            setUserState(parsedUser);
            return;
          }
        }

        setUserState(null);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminToken");
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, [pathname]);

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  sessionStorage.removeItem("adminUser");
  sessionStorage.removeItem("adminToken");

  setUserState(null);

  router.replace("/user/login");
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}