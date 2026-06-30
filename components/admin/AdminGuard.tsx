"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/user/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/user/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p style={{ padding: "30px" }}>Checking admin access...</p>;
  }

  if (!user || user.role !== "admin") {
    return <p style={{ padding: "30px" }}>Redirecting...</p>;
  }

  return <>{children}</>;
}