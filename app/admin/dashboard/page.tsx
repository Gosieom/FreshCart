"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingBag,
  Clock,
  DollarSign,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/api/adminDashboard";
import "./admin-dashboard.css";

type RecentUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

type DashboardStats = {
  totalUsers: number;
  adminUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentUsers: RecentUser[];
};

const defaultStats: DashboardStats = {
  totalUsers: 0,
  adminUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  lowStockProducts: 0,
  recentUsers: [],
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminDashboardStats();
      setStats(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      helper: `${stats.activeUsers} active users`,
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      helper: "Products in store",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      helper: "All customer orders",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      helper: "Need attention",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      helper: "From delivered orders",
    },
    {
      label: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      helper: "Products below limit",
    },
  ];

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-kicker">Overview</span>
          <h1>Admin Dashboard</h1>
          <p>Manage FreshCart users, products, orders, inventory, and banners.</p>
        </div>

        <button className="admin-dashboard-refresh" onClick={loadStats}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="admin-dashboard-state">
          <Loader2 className="admin-dashboard-spin" size={34} />
          <p>Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="admin-dashboard-state error">
          <AlertTriangle size={34} />
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
          <button onClick={loadStats}>Try Again</button>
        </div>
      ) : (
        <>
          <section className="admin-stats-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="admin-stat-card" key={card.label}>
                  <div className="admin-stat-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <p>{card.label}</p>
                    <h2>{card.value}</h2>
                    <span>{card.helper}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="admin-dashboard-row">
            <div className="admin-dashboard-panel">
              <div className="admin-panel-header">
                <h2>Recent Users</h2>
                <p>Latest accounts created in FreshCart.</p>
              </div>

              <div className="admin-recent-list">
                {stats.recentUsers.length === 0 ? (
                  <p className="admin-empty-text">No recent users found.</p>
                ) : (
                  stats.recentUsers.map((user) => (
                    <div className="admin-recent-user" key={user.id}>
                      <div className="admin-recent-avatar">
                        {(user.fullName || user.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3>{user.fullName || "Unnamed user"}</h3>
                        <p>{user.email}</p>
                      </div>

                      <span className={`admin-mini-role ${user.role}`}>
                        {user.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="admin-dashboard-panel">
              <div className="admin-panel-header">
                <h2>Next Features</h2>
                <p>Build these modules next.</p>
              </div>

              <ul className="admin-next-list">
                <li>Product Management with image upload</li>
                <li>Category Management</li>
                <li>Order Management and status update</li>
                <li>Inventory low-stock tracking</li>
                <li>Banner and promotion management</li>
              </ul>
            </div>
          </section>
        </>
      )}
    </main>
  );
}