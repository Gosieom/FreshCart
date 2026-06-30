"use client";

import { useEffect, useState } from "react";
import { getProductImageUrl, getProducts, Product } from "@/lib/api/products";

export default function UserProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 12,
        search,
      });

      setProducts(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "28px", margin: 0 }}>Fresh Products</h2>
          <p style={{ color: "#6b7280", marginTop: "6px" }}>
            Products added by admin will show here.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            style={{
              height: "44px",
              padding: "0 14px",
              borderRadius: "12px",
              border: "1px solid #dbe5d6",
            }}
          />

          <button
            onClick={loadProducts}
            style={{
              border: "none",
              background: "#16833a",
              color: "white",
              borderRadius: "12px",
              padding: "0 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              style={{
                background: "white",
                border: "1px solid #edf2ea",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  height: "150px",
                  borderRadius: "16px",
                  background: "#f3f6ef",
                  overflow: "hidden",
                  marginBottom: "14px",
                }}
              >
                {product.image ? (
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      color: "#6b7280",
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <p
                style={{
                  margin: "0 0 6px",
                  color: "#16833a",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {product.category}
              </p>

              <h3 style={{ margin: "0 0 6px", fontSize: "18px" }}>
                {product.name}
              </h3>

              <p
                style={{
                  margin: "0 0 12px",
                  color: "#6b7280",
                  fontSize: "14px",
                  minHeight: "38px",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong style={{ fontSize: "20px" }}>
                  ${product.price.toFixed(2)}
                </strong>

                <span style={{ color: "#6b7280", fontSize: "13px" }}>
                  per {product.unit}
                </span>
              </div>

              <button
                style={{
                  marginTop: "14px",
                  width: "100%",
                  height: "42px",
                  border: "none",
                  borderRadius: "12px",
                  background: product.stock > 0 ? "#16833a" : "#d1d5db",
                  color: "white",
                  fontWeight: 800,
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                }}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}