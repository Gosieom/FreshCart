"use client";

import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";

type Address = {
  id: number;
  title: string;
  detail: string;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      title: "Home",
      detail: "Basundhara, Kathmandu 44600, Nepal",
    },
    {
      id: 2,
      title: "Office",
      detail: "New Road, Kathmandu 44600, Nepal",
    },
  ]);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const addAddress = () => {
    if (!title.trim() || !detail.trim()) return;

    setAddresses((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        detail,
      },
    ]);

    setTitle("");
    setDetail("");
  };

  return (
    <AccountShell>
      <div className="account_page_header">
        <h1>Addresses</h1>
        <p>Manage delivery addresses for your FreshCart orders.</p>
      </div>

      <section className="account_section">
        <h2>Saved addresses</h2>

        <div className="account_card_grid">
          {addresses.map((address) => (
            <article className="account_card" key={address.id}>
              <h3>{address.title}</h3>
              <p>{address.detail}</p>

              <button
                type="button"
                className="account_change_btn"
                onClick={() =>
                  setAddresses((items) =>
                    items.filter((item) => item.id !== address.id)
                  )
                }
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="account_section">
        <h2>Add new address</h2>

        <div className="account_form_grid">
          <div className="account_form_group">
            <label>Address label</label>
            <input
              value={title}
              placeholder="Home, Office, Hostel..."
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="account_form_group">
            <label>Full address</label>
            <input
              value={detail}
              placeholder="Enter delivery address"
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>
        </div>

        <button type="button" className="account_save_btn" onClick={addAddress}>
          Add address
        </button>
      </section>
    </AccountShell>
  );
}