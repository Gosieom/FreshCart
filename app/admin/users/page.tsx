"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  AdminUser,
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
  UserPayload,
  UserRole,
  UserStatus,
} from "@/lib/api/adminUsers";

import "./admin-users.css";

type FormMode = "create" | "edit";

type UserFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
  status: "active",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminUsers({
        page,
        limit,
        search: debouncedSearch,
      });

      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedUser(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setFormMode("edit");
    setSelectedUser(user);

    setForm({
      name: user.fullName || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "user",
      status: user.status || "active",
    });

    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setSelectedUser(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email";
    }

    if (formMode === "create" && !form.password.trim()) {
      errors.password = "Password is required";
    }

    if (form.password && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!["user", "admin"].includes(form.role)) {
      errors.role = "Invalid role";
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

      const payload: UserPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        status: form.status,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (formMode === "create") {
        await createAdminUser(payload);
        toast.success("User created successfully");
      } else if (selectedUser) {
        await updateAdminUser(selectedUser.id, payload);
        toast.success("User updated successfully");
      }

      closeFormModal();
      await loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);

      await deleteAdminUser(deleteTarget.id);

      toast.success("User deleted successfully");
      setDeleteTarget(null);

      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadUsers();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
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
    <main className="admin-users-page">
      <section className="admin-users-header">
        <div>
          <div className="admin-users-kicker">
            <Users size={18} />
            <span>Admin Panel</span>
          </div>

          <h1>User Management</h1>
          <p>View, search, create, edit, and delete users.</p>
        </div>

        <button className="admin-primary-btn" onClick={openCreateModal}>
          <Plus size={18} />
          Create User
        </button>
      </section>

      <section className="admin-users-card">
        <div className="admin-users-toolbar">
          <div className="admin-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-users-count">
            {total} {total === 1 ? "user" : "users"}
          </div>
        </div>

        {isLoading ? (
          <div className="admin-state">
            <Loader2 className="admin-spin" size={32} />
            <h3>Loading users...</h3>
            <p>Please wait while we fetch user data.</p>
          </div>
        ) : error ? (
          <div className="admin-state admin-error-state">
            <AlertCircle size={34} />
            <h3>Unable to load users</h3>
            <p>{error}</p>
            <button className="admin-secondary-btn" onClick={loadUsers}>
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-state">
            <Users size={34} />
            <h3>No users found</h3>
            <p>
              {debouncedSearch
                ? "No users matched your search."
                : "Create your first user to get started."}
            </p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="admin-actions-head">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="admin-id-cell">{user.id.slice(-6)}</td>

                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-avatar">
                            {(user.fullName || user.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>{user.fullName || user.name || "Unnamed"}</span>
                        </div>
                      </td>

                      <td>{user.email}</td>
                      <td>{user.phone || "—"}</td>

                      <td>
                        <span
                          className={`admin-role-badge admin-role-${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge admin-status-${user.status}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td>{formatDate(user.createdAt)}</td>

                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-icon-btn"
                            onClick={() => openEditModal(user)}
                            title="Edit user"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="admin-icon-btn admin-danger-icon"
                            onClick={() => setDeleteTarget(user)}
                            title="Delete user"
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

            <div className="admin-pagination">
              <button
                className="admin-secondary-btn"
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
                className="admin-secondary-btn"
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
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>{formMode === "create" ? "Create User" : "Edit User"}</h2>
                <p>
                  {formMode === "create"
                    ? "Add a new user to the system."
                    : "Update selected user information."}
                </p>
              </div>

              <button className="admin-close-btn" onClick={closeFormModal}>
                <X size={20} />
              </button>
            </div>

            <form className="admin-user-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter full name"
                />
                {formErrors.name && <small>{formErrors.name}</small>}
              </div>

              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                />
                {formErrors.email && <small>{formErrors.email}</small>}
              </div>

              <div className="admin-form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="admin-form-group">
                <label>
                  Password{" "}
                  {formMode === "edit" && (
                    <span className="admin-muted">
                      Leave blank to keep current password
                    </span>
                  )}
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder={
                    formMode === "create"
                      ? "Enter password"
                      : "Enter new password"
                  }
                />

                {formErrors.password && <small>{formErrors.password}</small>}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        role: event.target.value as UserRole,
                      }))
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {formErrors.role && <small>{formErrors.role}</small>}
                </div>

                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.value as UserStatus,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formErrors.status && <small>{formErrors.status}</small>}
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="admin-spin" size={16} />}
                  {formMode === "create" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm-modal">
            <div className="admin-confirm-icon">
              <Trash2 size={26} />
            </div>

            <h2>Delete User?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.fullName || deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="admin-modal-actions">
              <button
                className="admin-secondary-btn"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="admin-danger-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="admin-spin" size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}