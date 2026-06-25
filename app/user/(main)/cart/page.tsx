"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  X,
  UserPlus,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import "./cart.css";

type CartItem = {
  id: number;
  name: string;
  image: string;
  qtyText: string;
  price: number;
  quantity: number;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Strawberries, Package",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&auto=format&fit=crop",
    qtyText: "1 lb",
    price: 235,
    quantity: 1,
  },
  {
    id: 2,
    name: "Pink Lady Apples, Bag",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&auto=format&fit=crop",
    qtyText: "3 lb",
    price: 385,
    quantity: 1,
  },
  {
    id: 3,
    name: "Honeycrisp Apples, Bag",
    image:
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=300&auto=format&fit=crop",
    qtyText: "2 lb",
    price: 475,
    quantity: 1,
  },
  {
    id: 4,
    name: "Mandarins, Bag",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&auto=format&fit=crop",
    qtyText: "3 lb",
    price: 439,
    quantity: 1,
  },
  {
    id: 5,
    name: "Raspberries, Package",
    image:
      "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=300&auto=format&fit=crop",
    qtyText: "6 oz",
    price: 299,
    quantity: 1,
  },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const increaseQuantity = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <main className="cart_page">
      <section className="cart_background">
        <div className="cart_background_top">
          <Link href="/user/dashboard" className="cart_back_logo">
            <img src="/freshcart-logo.png" alt="FreshCart Logo" />
            <span>FreshCart</span>
          </Link>

          <Link href="/user/dashboard" className="cart_continue_btn">
            Continue shopping
          </Link>
        </div>

        <div className="cart_background_content">
          <h1>Your FreshCart basket</h1>
          <p>
            Review your selected grocery items, update quantities, and continue
            to checkout.
          </p>
        </div>
      </section>

      <aside className="cart_panel">
        <header className="cart_header">
          <Link href="/user/dashboard" className="cart_close_btn">
            <X size={28} />
          </Link>

          <div className="cart_header_title">
            <h1>Personal Cart</h1>
            <p>Shopping in Basundhara, Kathmandu</p>
          </div>

          <button type="button" className="cart_invite_btn">
            <UserPlus size={25} />
          </button>
        </header>

        <section className="cart_store_header">
          <h2>Fresh Mart</h2>
          <p>⚡ Delivery by 2:40–3:00pm</p>
        </section>

        {cartItems.length === 0 ? (
          <section className="cart_empty_state">
            <div className="cart_empty_icon">
              <ShoppingCart size={42} />
            </div>

            <h2>Your cart is empty</h2>
            <p>Add fresh fruits, vegetables, dairy, bakery, and grocery items.</p>

            <Link href="/user/dashboard">Start shopping</Link>
          </section>
        ) : (
          <>
            <section className="cart_items_list">
              {cartItems.map((item) => (
                <article className="cart_item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart_item_info">
                    <h3>
                      {item.name} ({item.qtyText})
                    </h3>

                    <strong>{formatPrice(item.price)}</strong>

                    <button type="button" className="cart_replace_btn">
                      <RotateCcw size={16} />
                      Replace with best match
                    </button>
                  </div>

                  <div className="cart_quantity_control">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={22} />
                    </button>

                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={20} />
                    </button>

                    <span>{item.quantity} ct</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <section className="cart_summary">
              <div className="cart_summary_row">
                <h2>Item subtotal</h2>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <p>
                <b>Offers and benefits</b> · Applied at checkout. Not all may
                combine.
              </p>

              <span>
                <CheckCircle size={18} />
                $0 delivery fee
              </span>

              <button
                type="button"
                className="cart_clear_btn"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </section>

            <section className="cart_delivery_fee">
              <div>
                <CheckCircle size={18} />
                <span>$0 delivery fee</span>
              </div>

              <ChevronRight size={22} />
            </section>

            <section className="cart_checkout_bar">
              <button type="button">
                <span>Go to checkout</span>
                <strong>{formatPrice(subtotal)}</strong>
              </button>

              <p>
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </section>
          </>
        )}
      </aside>
    </main>
  );
}