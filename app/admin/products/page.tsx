"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  AdminProduct,
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getProductImageUrl,
  ProductPayload,
  ProductStatus,
  updateAdminProduct,
} from "@/lib/api/adminProducts";

import "./admin-products.css";

type FormMode = "create" | "edit";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  unit: string;
  status: ProductStatus;
  image: File | null;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  unit: "kg",
  status: "active",
  image: null,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null
  );

  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [page, debouncedSearch]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminProducts({
        page,
        limit,
        search: debouncedSearch,
      });

      setProducts(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setFormMode("edit");
    setSelectedProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      stock: String(product.stock ?? ""),
      unit: product.unit || "kg",
      status: product.status || "active",
      image: null,
    });

    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setSelectedProduct(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) errors.name = "Product name is required";
    if (!form.category.trim()) errors.category = "Category is required";

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.price.trim()) {
      errors.price = "Price is required";
    } else if (Number.isNaN(price) || price < 0) {
      errors.price = "Enter a valid price";
    }

    if (!form.stock.trim()) {
      errors.stock = "Stock is required";
    } else if (Number.isNaN(stock) || stock < 0) {
      errors.stock = "Enter valid stock";
    }

    if (!["active", "inactive"].includes(form.status)) {
      errors.status = "Invalid status";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload: ProductPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        category: form.category.trim(),
        stock: form.stock.trim(),
        unit: form.unit.trim() || "piece",
        status: form.status,
        image: form.image,
      };

      if (formMode === "create") {
        await createAdminProduct(payload);
        toast.success("Product created successfully");
      } else if (selectedProduct) {
        await updateAdminProduct(selectedProduct.id, payload);
        toast.success("Product updated successfully");
      }

      closeFormModal();
      await loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);

      await deleteAdminProduct(deleteTarget.id);

      toast.success("Product deleted successfully");
      setDeleteTarget(null);

      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadProducts();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (price: number) => {
    return `$${Number(price || 0).toFixed(2)}`;
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="admin-products-page">
      <section className="admin-products-header">
        <div>
          <div className="admin-products-kicker">
            <Package size={18} />
            <span>Product Management</span>
          </div>

          <h1>Products</h1>
          <p>Add, edit, delete, search, and manage FreshCart products.</p>
        </div>

        <button className="admin-product-primary-btn" onClick={openCreateModal}>
          <Plus size={18} />
          Create Product
        </button>
      </section>

      <section className="admin-products-card">
        <div className="admin-products-toolbar">
          <div className="admin-product-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by product or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-products-count">
            {total} {total === 1 ? "product" : "products"}
          </div>
        </div>

        {isLoading ? (
          <div className="admin-product-state">
            <Loader2 className="admin-product-spin" size={32} />
            <h3>Loading products...</h3>
            <p>Please wait while we fetch product data.</p>
          </div>
        ) : error ? (
          <div className="admin-product-state admin-product-error-state">
            <AlertTriangle size={34} />
            <h3>Unable to load products</h3>
            <p>{error}</p>
            <button className="admin-product-secondary-btn" onClick={loadProducts}>
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="admin-product-state">
            <Package size={34} />
            <h3>No products found</h3>
            <p>
              {debouncedSearch
                ? "No products matched your search."
                : "Create your first product to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="admin-product-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="admin-product-actions-head">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="admin-product-id-cell">
                        {product.id.slice(-6)}
                      </td>

                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-image">
                            {product.image ? (
                              <img
                                src={getProductImageUrl(product.image)}
                                alt={product.name}
                              />
                            ) : (
                              <ImageIcon size={20} />
                            )}
                          </div>

                          <div>
                            <strong>{product.name}</strong>
                            <p>{product.description || "No description"}</p>
                          </div>
                        </div>
                      </td>

                      <td>{product.category}</td>
                      <td>{formatCurrency(product.price)}</td>

                      <td>
                        <span
                          className={
                            product.stock === 0
                              ? "admin-stock-badge out"
                              : product.stock <= 10
                              ? "admin-stock-badge low"
                              : "admin-stock-badge good"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>{product.unit}</td>

                      <td>
                        <span
                          className={`admin-product-status admin-product-status-${product.status}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td>{formatDate(product.createdAt)}</td>

                      <td>
                        <div className="admin-product-actions">
                          <button
                            className="admin-product-icon-btn"
                            onClick={() => openEditModal(product)}
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="admin-product-icon-btn admin-product-danger-icon"
                            onClick={() => setDeleteTarget(product)}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-product-pagination">
              <button
                className="admin-product-secondary-btn"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                className="admin-product-secondary-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>

      {isFormOpen && (
        <div className="admin-product-modal-overlay">
          <div className="admin-product-modal">
            <div className="admin-product-modal-header">
              <div>
                <h2>
                  {formMode === "create" ? "Create Product" : "Edit Product"}
                </h2>
                <p>
                  {formMode === "create"
                    ? "Add a new product to FreshCart."
                    : "Update product details."}
                </p>
              </div>

              <button className="admin-product-close-btn" onClick={closeFormModal}>
                <X size={20} />
              </button>
            </div>

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="admin-product-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Apple"
                />
                {formErrors.name && <small>{formErrors.name}</small>}
              </div>

              <div className="admin-product-form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Fresh organic product..."
                />
              </div>

              <div className="admin-product-form-row">
                <div className="admin-product-form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        price: event.target.value,
                      }))
                    }
                    placeholder="2.99"
                  />
                  {formErrors.price && <small>{formErrors.price}</small>}
                </div>

                <div className="admin-product-form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: event.target.value,
                      }))
                    }
                    placeholder="50"
                  />
                  {formErrors.stock && <small>{formErrors.stock}</small>}
                </div>
              </div>

              <div className="admin-product-form-row">
                <div className="admin-product-form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Fruits"
                  />
                  {formErrors.category && <small>{formErrors.category}</small>}
                </div>

                <div className="admin-product-form-group">
                  <label>Unit</label>
                  <select
                    value={form.unit}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, unit: event.target.value }))
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="piece">piece</option>
                    <option value="pack">pack</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div className="admin-product-form-row">
                <div className="admin-product-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.value as ProductStatus,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formErrors.status && <small>{formErrors.status}</small>}
                </div>

                <div className="admin-product-form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        image: event.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-product-modal-actions">
                <button
                  type="button"
                  className="admin-product-secondary-btn"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-product-primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="admin-product-spin" size={16} />
                  )}
                  {formMode === "create" ? "Create Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-product-modal-overlay">
          <div className="admin-product-confirm-modal">
            <div className="admin-product-confirm-icon">
              <Trash2 size={26} />
            </div>

            <h2>Delete Product?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="admin-product-modal-actions">
              <button
                className="admin-product-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="admin-product-danger-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2 className="admin-product-spin" size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}