export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    whoami: `${API_BASE_URL}/auth/whoami`,
    updateProfile: `${API_BASE_URL}/auth/update`,
    profileImage: `${API_BASE_URL}/auth/profile-image`,
    requestPasswordReset: `${API_BASE_URL}/auth/request-password-reset`,
    resetPassword: (token: string) =>
      `${API_BASE_URL}/auth/reset-password/${token}`,
  },

  admin: {
    dashboard: `${API_BASE_URL}/admin/dashboard`,

    users: `${API_BASE_URL}/admin/users`,
    userById: (id: string) => `${API_BASE_URL}/admin/users/${id}`,

    products: `${API_BASE_URL}/admin/products`,
    productById: (id: string) => `${API_BASE_URL}/admin/products/${id}`,

    categories: `${API_BASE_URL}/admin/categories`,
    categoryById: (id: string) => `${API_BASE_URL}/admin/categories/${id}`,
  },

  public: {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
  },
};