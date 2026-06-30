"use client";

import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";

const settings = [
  {
    key: "orderUpdates",
    title: "Order updates",
    description: "Get notified when your order is confirmed or delivered.",
  },
  {
    key: "offers",
    title: "Offers and discounts",
    description: "Receive FreshCart deals and discount alerts.",
  },
  {
    key: "wishlist",
    title: "Wishlist reminders",
    description: "Get reminders when wishlist items are on discount.",
  },
  {
    key: "delivery",
    title: "Delivery alerts",
    description: "Receive updates about delivery time and address.",
  },
];

export default function NotificationSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    orderUpdates: true,
    offers: true,
    wishlist: false,
    delivery: true,
  });

  const toggle = (key: string) => {
    setEnabled((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AccountShell>
      <div className="account_page_header">
        <h1>Notification settings</h1>
        <p>Choose what updates you want to receive from FreshCart.</p>
      </div>

      <section className="account_section">
        <h2>Notifications</h2>

        {settings.map((item) => (
          <div className="account_toggle_row" key={item.key}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <button
              type="button"
              className={enabled[item.key] ? "account_switch on" : "account_switch"}
              onClick={() => toggle(item.key)}
            >
              <span />
            </button>
          </div>
        ))}
      </section>
    </AccountShell>
  );
}