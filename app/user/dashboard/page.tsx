"use client";

import Link from "next/link";
import {
  MapPin,
  ShoppingCart,
  User,
  Search,
  SlidersHorizontal,
  Heart,
  Plus,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import "./dashboard.css";

const categories = [
  {
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop",
  },
  {
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop",
  },
  {
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop",
  },
  {
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop",
  },
];

const products = [
  {
    name: "Fresh Apple",
    qty: "1 kg",
    price: "Rs. 180",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop",
  },
  {
    name: "Banana",
    qty: "1 dozen",
    price: "Rs. 120",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop",
  },
  {
    name: "Tomato",
    qty: "1 kg",
    price: "Rs. 90",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop",
  },
  {
    name: "Carrot",
    qty: "1 kg",
    price: "Rs. 80",
    image:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500&auto=format&fit=crop",
  },
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p className="dashboard_loading">Loading dashboard...</p>;
  }

  if (!user) {
    return <p className="dashboard_loading">Please login first.</p>;
  }

  return (
    <main className="fresh_dashboard">
      <section className="dashboard_shell">
        <header className="top_header">
          <Link href="/user/address" className="location_box">
            <div className="location_icon">
              <MapPin size={22} />
            </div>

            <div>
              <p>Deliver to Home</p>
              <h3>Basundhara, Kathmandu 44600</h3>
            </div>
          </Link>

          <div className="header_actions">
            <Link href="/user/cart" className="round_icon">
              <ShoppingCart size={22} />
            </Link>

            <Link href="/user/profile" className="round_icon">
              <User size={22} />
            </Link>
          </div>
        </header>

        <div className="search_bar">
          <Search size={22} />
          <input placeholder="Search groceries, fruits, snacks..." />
          <SlidersHorizontal size={22} />
        </div>

        <section className="hero_banner">
          <div>
            <h1>Healthy Fruits</h1>
            <p>Sweet, fresh and handpicked for you.</p>
            <button>Buy More, Save More</button>
          </div>
        </section>

        <section className="section_header">
          <h2>Shop by category</h2>
          <Link href="/user/categories">See all</Link>
        </section>

        <section className="category_grid">
          {categories.map((category) => (
            <Link
              href="/user/categories"
              className="category_card"
              key={category.name}
            >
              <img src={category.image} alt={category.name} />
              <p>{category.name}</p>
            </Link>
          ))}
        </section>

        <section className="section_header">
          <h2>Recommended for you</h2>
        </section>

        <section className="product_grid">
          {products.map((product) => (
            <article className="product_card" key={product.name}>
              <button className="heart_btn" type="button">
                <Heart size={20} />
              </button>

              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>
              <p>{product.qty}</p>

              <div className="product_footer">
                <strong>{product.price}</strong>

                <button type="button">
                  <Plus size={22} />
                </button>
              </div>
            </article>
          ))}
        </section>

        <button className="logout_btn" onClick={logout} type="button">
          <LogOut size={18} />
          Logout
        </button>
      </section>
    </main>
  );
}