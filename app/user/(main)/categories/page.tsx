"use client";

import Link from "next/link";
import { ArrowLeft, Check, Heart, Plus } from "lucide-react";
import "./categories.css";

const filters = ["All", "Fruits", "Vegetables", "Grocery", "Bakery"];

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
  {
    name: "Rice",
    qty: "5 kg",
    price: "Rs. 750",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop",
  },
  {
    name: "Bread",
    qty: "1 pack",
    price: "Rs. 95",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
  },
];

export default function CategoriesPage() {
  return (
    <main className="categories_page">
      <section className="categories_shell">
        <header className="categories_header">
          <Link href="/user/dashboard" className="back_btn">
            <ArrowLeft size={24} />
          </Link>

          <h1>All Categories</h1>

          <div className="header_space" />
        </header>

        <section className="filter_row">
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={index === 0 ? "filter_chip active" : "filter_chip"}
            >
              {index === 0 && <Check size={16} />}
              {filter}
            </button>
          ))}
        </section>

        <section className="category_product_grid">
          {products.map((product) => (
            <article className="category_product_card" key={product.name}>
              <button className="category_heart_btn">
                <Heart size={20} />
              </button>

              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>
              <p>{product.qty}</p>

              <div className="category_product_footer">
                <strong>{product.price}</strong>
                <button>
                  <Plus size={22} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}