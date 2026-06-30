"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Heart,
  History,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import "./account.css";

type AccountShellProps = {
  children: React.ReactNode;
};

const menuItems = [
  {
    label: "Order history",
    href: "/user/account/orders",
    icon: History,
  },
  {
    label: "Wishlist",
    href: "/user/account/wishlist",
    icon: Heart,
  },
  {
    label: "Addresses",
    href: "/user/account/addresses",
    icon: MapPin,
  },
  {
    label: "Payment methods",
    href: "/user/account/payment",
    icon: CreditCard,
  },
  {
    label: "Notification settings",
    href: "/user/account/notifications",
    icon: Bell,
  },
  {
    label: "Account settings",
    href: "/user/account",
    icon: Settings,
  },
];

export default function AccountShell({ children }: AccountShellProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <main className="account_page">
      <header className="account_topbar">
        <div className="account_brand_area">
          <button type="button" className="account_menu_btn">
            <Menu size={24} />
          </button>

          <Link href="/user/dashboard" className="account_logo">
            <img src="/freshcart-logo.png" alt="FreshCart Logo" />
            <span>FreshCart</span>
          </Link>
        </div>

        <div className="account_search">
          <Search size={22} />
          <input placeholder="Search products and groceries" />
        </div>

        <Link href="/user/dashboard" className="account_location">
          <MapPin size={22} />
          <span>Basundhara, Kathmandu</span>
        </Link>

        <Link href="/user/dashboard" className="account_cart">
          <ShoppingCart size={22} />
          <span>Cart</span>
        </Link>
      </header>

      <div className="account_layout">
        <aside className="account_sidebar">
          <Link href="/user/dashboard" className="account_back_link">
            <ArrowLeft size={21} />
            Back
          </Link>

          <nav className="account_nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "active" : ""}
                >
                  <Icon size={23} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button type="button" className="account_logout" onClick={logout}>
            <LogOut size={22} />
            Log out
          </button>
        </aside>

        <section className="account_content">{children}</section>
      </div>
    </main>
  );
}