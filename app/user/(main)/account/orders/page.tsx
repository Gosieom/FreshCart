"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Loader2,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

import AccountShell from "@/components/account/AccountShell";
import { getMyOrders, Order, OrderStatus } from "@/lib/api/orders";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const getOrderImageUrl = (image?: string) => {
  if (!image) return "/freshcart-logo.png";
  if (image.startsWith("http")) return image;
  if (image.startsWith("data:")) return image;
  if (image.startsWith("blob:")) return image;

  return `${SERVER_URL}${image.startsWith("/") ? image : `/${image}`}`;
};


const CHECKOUT_STORAGE_KEY = "freshcart_checkout_items";

const formatPrice = (amount: number) => {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status: OrderStatus) => {
  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    packed: "Packed",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
};

const getStatusClass = (status: OrderStatus) => {
  return `order_status order_status_${status}`;
};

export default function OrderHistoryPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getMyOrders();
      setOrders(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalSpent = useMemo(() => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }, [orders]);

  const totalItems = useMemo(() => {
    return orders.reduce((total, order) => {
      const itemCount = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return total + itemCount;
    }, 0);
  }, [orders]);

  const handleReorder = (order: Order) => {
    const checkoutItems = order.items.map((item) => ({
      product: item.product,
      productId: item.product,
      name: item.name,
      image: item.image,
      unit: item.unit,
      category: item.category,
      priceNumber: item.price,
      quantity: item.quantity,
    }));

    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutItems));

    router.push("/user/checkout");
  };

  return (
    <AccountShell>
      <div className="account_page_header">
        <h1>Order history</h1>
        <p>View your FreshCart orders and track their current status.</p>
      </div>

      <div className="orders_summary_grid">
        <article className="orders_summary_card">
          <ShoppingBag size={22} />
          <div>
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </div>
        </article>

        <article className="orders_summary_card">
          <Package size={22} />
          <div>
            <span>Total items</span>
            <strong>{totalItems}</strong>
          </div>
        </article>

        <article className="orders_summary_card">
          <CalendarDays size={22} />
          <div>
            <span>Total spent</span>
            <strong>{formatPrice(totalSpent)}</strong>
          </div>
        </article>
      </div>

      {isLoading && (
        <div className="orders_state">
          <Loader2 className="orders_spin" size={34} />
          <h3>Loading orders...</h3>
          <p>Please wait while we load your order history.</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="orders_state orders_error">
          <Package size={36} />
          <h3>Unable to load orders</h3>
          <p>{error}</p>

          <button type="button" onClick={loadOrders}>
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="orders_state">
          <ShoppingBag size={38} />
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>

          <Link href="/user/grocery">Start shopping</Link>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="orders_list">
          {orders.map((order) => {
            const itemNames = order.items.map((item) => item.name).join(", ");
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <article className="order_card" key={order.id}>
                <div className="order_top">
                  <div>
                    <h3>Order {order.orderNumber}</h3>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>

                  <span className={getStatusClass(order.orderStatus)}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>

                <div className="order_items">
                  <strong>{itemCount} item(s)</strong>
                  <p>{itemNames}</p>
                </div>

                <div className="order_products_preview">
                  {order.items.slice(0, 4).map((item) => (
                    <div className="order_product_item" key={item.product}>
                      <img
                        src={getOrderImageUrl(item.image)}
                        alt={item.name}
                      />

                      <div>
                        <h4>{item.name}</h4>
                        <p>
                          {item.quantity} × {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order_delivery_box">
                  <strong>Delivery address</strong>
                  <p>
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                    {order.shippingAddress.province
                      ? `, ${order.shippingAddress.province}`
                      : ""}
                  </p>
                </div>

                <div className="order_bottom">
                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.paymentMethod === "cash_on_delivery"
                        ? "Cash on delivery"
                        : "Online payment"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>{formatPrice(order.totalAmount)}</strong>
                  </div>

                  <button
                    type="button"
                    className="reorder_btn"
                    onClick={() => handleReorder(order)}
                  >
                    <RotateCcw size={17} />
                    Reorder
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .orders_summary_grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .orders_summary_card {
          background: #ffffff;
          border: 1px solid #e5eadf;
          border-radius: 18px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #16833a;
        }

        .orders_summary_card span {
          display: block;
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .orders_summary_card strong {
          color: #102010;
          font-size: 22px;
          font-weight: 950;
        }

        .orders_list {
          display: grid;
          gap: 18px;
        }

        .order_card {
          background: #ffffff;
          border: 1px solid #e5eadf;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.06);
        }

        .order_top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .order_top h3 {
          margin: 0;
          color: #102010;
          font-size: 19px;
          font-weight: 950;
        }

        .order_top p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 14px;
          font-weight: 650;
        }

        .order_status {
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .order_status_pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .order_status_confirmed {
          background: #e7f0ff;
          color: #1d4ed8;
        }

        .order_status_packed {
          background: #f5f3ff;
          color: #6d28d9;
        }

        .order_status_out_for_delivery {
          background: #ecfeff;
          color: #0891b2;
        }

        .order_status_delivered {
          background: #e7f8eb;
          color: #16833a;
        }

        .order_status_cancelled {
          background: #fff1f2;
          color: #dc2626;
        }

        .order_items {
          border-top: 1px solid #edf2ea;
          padding-top: 14px;
          margin-bottom: 14px;
        }

        .order_items strong {
          display: block;
          color: #102010;
          margin-bottom: 5px;
        }

        .order_items p {
          margin: 0;
          color: #6b7280;
          line-height: 1.5;
          font-weight: 600;
        }

        .order_products_preview {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .order_product_item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8faf6;
          border-radius: 14px;
          padding: 10px;
        }

        .order_product_item img {
          width: 46px;
          height: 46px;
          border-radius: 11px;
          object-fit: cover;
          background: #ffffff;
        }

        .order_product_item h4 {
          margin: 0 0 3px;
          color: #102010;
          font-size: 14px;
          font-weight: 900;
        }

        .order_product_item p {
          margin: 0;
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
        }

        .order_delivery_box {
          background: #f8faf6;
          border-radius: 14px;
          padding: 13px;
          margin-bottom: 16px;
        }

        .order_delivery_box strong {
          display: block;
          color: #102010;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .order_delivery_box p {
          margin: 0;
          color: #6b7280;
          font-weight: 650;
          line-height: 1.45;
        }

        .order_bottom {
          border-top: 1px solid #edf2ea;
          padding-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          align-items: center;
          gap: 16px;
        }

        .order_bottom span {
          display: block;
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .order_bottom strong {
          color: #102010;
          font-size: 17px;
          font-weight: 950;
        }

        .reorder_btn {
          border: none;
          background: #16833a;
          color: #ffffff;
          border-radius: 999px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }

        .reorder_btn:hover {
          background: #106b2d;
        }

        .orders_state {
          min-height: 320px;
          border: 1px dashed #d1d5db;
          background: #ffffff;
          border-radius: 20px;
          display: grid;
          place-items: center;
          align-content: center;
          text-align: center;
          gap: 8px;
          padding: 30px;
          color: #16833a;
        }

        .orders_state h3 {
          margin: 8px 0 0;
          color: #102010;
          font-size: 22px;
          font-weight: 950;
        }

        .orders_state p {
          margin: 0;
          color: #6b7280;
          font-weight: 650;
        }

        .orders_state a,
        .orders_state button {
          margin-top: 10px;
          border: none;
          background: #16833a;
          color: #ffffff;
          text-decoration: none;
          border-radius: 999px;
          padding: 12px 18px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .orders_error {
          color: #dc2626;
        }

        .orders_error button {
          background: #dc2626;
        }

        .orders_spin {
          animation: ordersSpin 0.8s linear infinite;
        }

        @keyframes ordersSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 780px) {
          .orders_summary_grid,
          .order_products_preview {
            grid-template-columns: 1fr;
          }

          .order_top {
            flex-direction: column;
            align-items: flex-start;
          }

          .order_bottom {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }

          .reorder_btn {
            width: 100%;
          }
        }
      `}</style>
    </AccountShell>
  );
}