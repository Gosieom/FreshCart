"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const BACKEND_URL = "http://localhost:5000";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;
  }

  if (!user) {
    return <p style={{ padding: "2rem" }}>Please login first.</p>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullName}!</p>

      {user.profileImage && (
        <img
          src={`${BACKEND_URL}${user.profileImage}`}
          alt="Profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
            marginTop: "1rem",
          }}
        />
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone || "Not added"}</p>
      </div>

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "10px" }}>
        <Link href="/user/profile">Update Profile</Link>
        <Link href="/user/password">Update Password</Link>

        <button
          onClick={logout}
          style={{
            width: "120px",
            padding: "10px",
            background: "crimson",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}