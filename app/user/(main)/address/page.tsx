"use client";

import Link from "next/link";
import {
  X,
  Search,
  Circle,
  CheckCircle2,
  LocateFixed,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import "./address.css";

const addresses = [
  {
    id: 1,
    type: "Home",
    title: "Basundhara, Kathmandu 44600",
    subtitle: "Near Tokha Road, Kathmandu, Nepal",
  },
  {
    id: 2,
    type: "Work",
    title: "Maharajgunj, Kathmandu 44600",
    subtitle: "Near Teaching Hospital, Kathmandu, Nepal",
  },
  {
    id: 3,
    type: "Family Address",
    title: "Lalitpur, Bagmati Province",
    subtitle: "Patan area, Lalitpur, Nepal",
  },
];

export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState(1);

  return (
    <main className="address_page">
      <section className="address_shell">
        <header className="address_header">
          <Link href="/user/dashboard" className="close_btn">
            <X size={26} />
          </Link>

          <h1>Choose address</h1>
        </header>

        <div className="address_search">
          <Search size={22} />
          <input placeholder="Add a new address" />
        </div>

        <h2 className="saved_title">Saved addresses</h2>

        <section className="address_list">
          {addresses.map((address) => {
            const isSelected = selectedAddress === address.id;

            return (
              <article
                key={address.id}
                className={
                  isSelected ? "address_card active" : "address_card"
                }
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="address_radio">
                  {isSelected ? (
                    <CheckCircle2 size={26} />
                  ) : (
                    <Circle size={26} />
                  )}
                </div>

                <div className="address_content">
                  <h3>{address.type}</h3>
                  <h4>{address.title}</h4>
                  <p>{address.subtitle}</p>
                </div>

                <button className="edit_btn">Edit</button>
              </article>
            );
          })}
        </section>

        <button className="current_location_card">
          <div className="current_location_icon">
            <LocateFixed size={24} />
          </div>

          <span>Use current location</span>

          <ChevronRight size={24} />
        </button>

        <div className="address_divider" />

        <h2 className="region_title">Country / Region</h2>

        <div className="country_card">
          <span className="flag">🇳🇵</span>
          <strong>Nepal</strong>
        </div>

        <button className="confirm_address_btn">
          Confirm Address
        </button>
      </section>
    </main>
  );
}