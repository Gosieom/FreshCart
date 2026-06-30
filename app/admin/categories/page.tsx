"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import {
  AdminCategory,
  CategoryPayload,
  CategoryStatus,
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getCategoryImageUrl,
  updateAdminCategory,
} from "@/lib/api/adminCategories";

import "./admin-categories.css";

type FormMode = "create" | "edit";

type CategoryFormState = {
  name: string;
  description: string;
  status: CategoryStatus;
  image: File | null;
};

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
  status: "active",
  image: null,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
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
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);

  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminCategories({
        page,
        limit,
        search: debouncedSearch,
      });

      setCategories(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedCategory(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (category: AdminCategory) => {
    setFormMode("edit");
    setSelectedCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "active",
      image: null,
    });

    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setSelectedCategory(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Category name is required";
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

      const payload: CategoryPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        image: form.image,
      };

      if (formMode === "create") {
        await createAdminCategory(payload);
        toast.success("Category created successfully");
      } else if (selectedCategory) {
        await updateAdminCategory(selectedCategory.id, payload);
        toast.success("Category updated successfully");
      }

      closeFormModal();
      await loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);

      await deleteAdminCategory(deleteTarget.id);

      toast.success("Category deleted successfully");
      setDeleteTarget(null);

      if (categories.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadCategories();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
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
    <main className="admin-categories-page">
      <section className="admin-categories-header">
        <div>
          <div className="admin-categories-kicker">
            <Tags size={18} />
            <span>Category Management</span>
          </div>

          <h1>Categories</h1>
          <p>Create, edit, delete, and manage FreshCart categories.</p>
        </div>

        <button
          className="admin-category-primary-btn"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Create Category
        </button>
      </section>

      <section className="admin-categories-card">
        <div className="admin-categories-toolbar">
          <div className="admin-category-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by category name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-categories-count">
            {total} {total === 1 ? "category" : "categories"}
          </div>
        </div>

        {isLoading ? (
          <div className="admin-category-state">
            <Loader2 className="admin-category-spin" size={32} />
            <h3>Loading categories...</h3>
            <p>Please wait while we fetch category data.</p>
          </div>
        ) : error ? (
          <div className="admin-category-state admin-category-error-state">
            <AlertTriangle size={34} />
            <h3>Unable to load categories</h3>
            <p>{error}</p>
            <button
              className="admin-category-secondary-btn"
              onClick={loadCategories}
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-category-state">
            <Tags size={34} />
            <h3>No categories found</h3>
            <p>
              {debouncedSearch
                ? "No categories matched your search."
                : "Create your first category to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="admin-category-table-wrapper">
              <table className="admin-categories-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="admin-category-actions-head">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="admin-category-id-cell">
                        {category.id.slice(-6)}
                      </td>

                      <td>
                        <div className="admin-category-cell">
                          <div className="admin-category-image">
                            {category.image ? (
                              <img
                                src={getCategoryImageUrl(category.image)}
                                alt={category.name}
                              />
                            ) : (
                              <ImageIcon size={20} />
                            )}
                          </div>

                          <div>
                            <strong>{category.name}</strong>
                            <p>{category.status}</p>
                          </div>
                        </div>
                      </td>

                      <td>{category.description || "No description"}</td>

                      <td>
                        <span
                          className={`admin-category-status admin-category-status-${category.status}`}
                        >
                          {category.status}
                        </span>
                      </td>

                      <td>{formatDate(category.createdAt)}</td>

                      <td>
                        <div className="admin-category-actions">
                          <button
                            className="admin-category-icon-btn"
                            onClick={() => openEditModal(category)}
                            title="Edit category"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="admin-category-icon-btn admin-category-danger-icon"
                            onClick={() => setDeleteTarget(category)}
                            title="Delete category"
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

            <div className="admin-category-pagination">
              <button
                className="admin-category-secondary-btn"
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
                className="admin-category-secondary-btn"
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
        <div className="admin-category-modal-overlay">
          <div className="admin-category-modal">
            <div className="admin-category-modal-header">
              <div>
                <h2>
                  {formMode === "create" ? "Create Category" : "Edit Category"}
                </h2>
                <p>
                  {formMode === "create"
                    ? "Add a new category to FreshCart."
                    : "Update category details."}
                </p>
              </div>

              <button
                className="admin-category-close-btn"
                onClick={closeFormModal}
              >
                <X size={20} />
              </button>
            </div>

            <form className="admin-category-form" onSubmit={handleSubmit}>
              <div className="admin-category-form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Fruits"
                />
                {formErrors.name && <small>{formErrors.name}</small>}
              </div>

              <div className="admin-category-form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Fresh fruits and seasonal produce..."
                />
              </div>

              <div className="admin-category-form-row">
                <div className="admin-category-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.value as CategoryStatus,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formErrors.status && <small>{formErrors.status}</small>}
                </div>

                <div className="admin-category-form-group">
                  <label>Category Image</label>
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

              <div className="admin-category-modal-actions">
                <button
                  type="button"
                  className="admin-category-secondary-btn"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-category-primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="admin-category-spin" size={16} />
                  )}
                  {formMode === "create" ? "Create Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-category-modal-overlay">
          <div className="admin-category-confirm-modal">
            <div className="admin-category-confirm-icon">
              <Trash2 size={26} />
            </div>

            <h2>Delete Category?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="admin-category-modal-actions">
              <button
                className="admin-category-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="admin-category-danger-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2 className="admin-category-spin" size={16} />
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