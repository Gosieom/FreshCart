"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingBag,
  Boxes,
  ImageIcon,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/lib/contexts/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";

import "./admin-layout.css";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <AdminGuard>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-icon">F</div>

            <div>
              <h2>FreshCart</h2>
              <p>Admin Panel</p>
            </div>
          </div>

          <nav className="admin-nav">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <section className="admin-shell-content">{children}</section>
      </div>
    </AdminGuard>
  );
}