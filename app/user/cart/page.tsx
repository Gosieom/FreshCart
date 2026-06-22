"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import "./cart.css";

export default function CartPage() {
  return (
    <main className="cart_page">
      <section className="cart_shell">
        <header className="cart_header">
          <Link href="/user/dashboard" className="cart_back_btn">
            <ArrowLeft size={24} />
          </Link>

          <h1>My Cart</h1>

          <div className="cart_header_space" />
        </header>

        <section className="empty_cart_box">
          <div className="empty_cart_icon">
            <ShoppingCart size={92} />
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add fresh groceries to your cart and they will appear here.
          </p>

          <Link href="/user/dashboard" className="start_shopping_btn">
            Start Shopping
          </Link>
        </section>
      </section>
    </main>
  );
}