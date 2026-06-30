"use client";

import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";

const initialWishlist = [
  {
    id: 1,
    name: "Fresh Apple",
    qty: "1 kg",
    price: "Rs. 160",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Orange Juice",
    qty: "1 liter",
    price: "Rs. 199",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Fresh Bread",
    qty: "1 packet",
    price: "Rs. 85",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  return (
    <AccountShell>
      <div className="account_page_header">
        <h1>Wishlist</h1>
        <p>Save your favorite grocery items and add them to cart later.</p>
      </div>

      {wishlist.length === 0 ? (
        <section className="account_card">
          <h3>Your wishlist is empty</h3>
          <p>Add items to your wishlist from the FreshCart dashboard.</p>
        </section>
      ) : (
        <div className="wishlist_grid">
          {wishlist.map((item) => (
            <article className="wishlist_card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <h3>{item.name}</h3>
              <p>
                {item.qty} · {item.price}
              </p>

              <div className="wishlist_actions">
                <button type="button">Add to cart</button>

                <button
                  type="button"
                  className="wishlist_remove"
                  onClick={() =>
                    setWishlist((items) =>
                      items.filter((product) => product.id !== item.id)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountShell>
  );
}