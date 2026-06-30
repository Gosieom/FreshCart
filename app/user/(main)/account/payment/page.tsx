"use client";

import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      title: "Cash on delivery",
      detail: "Pay when your groceries arrive.",
    },
  ]);

  const addEsewa = () => {
    setPaymentMethods((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "eSewa",
        detail: "Digital payment method added.",
      },
    ]);
  };

  return (
    <AccountShell>
      <div className="account_page_header">
        <h1>Payment methods</h1>
        <p>Manage your payment options for FreshCart checkout.</p>
      </div>

      <section className="account_section">
        <h2>Saved payment methods</h2>

        <div className="account_card_grid">
          {paymentMethods.map((method) => (
            <article className="account_card" key={method.id}>
              <h3>{method.title}</h3>
              <p>{method.detail}</p>
              <span className="account_card_meta">Available</span>
            </article>
          ))}
        </div>
      </section>

      <section className="account_section">
        <h2>Add payment method</h2>

        <div className="account_card">
          <h3>Digital wallet</h3>
          <p>Add eSewa or Khalti style wallet payment for future checkout.</p>

          <button type="button" className="account_save_btn" onClick={addEsewa}>
            Add eSewa
          </button>
        </div>
      </section>
    </AccountShell>
  );
}