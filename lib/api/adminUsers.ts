export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive";

export type AdminUser = {
  id: string;
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUsersResponse = {
  data: AdminUser[];
  meta: PaginationMeta;
};

export type UserPayload = {
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

function getAdminToken() {
  if (typeof window === "undefined") return null;

  return (
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken")
  );
}

function buildQuery(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();

  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 10));

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  return query.toString();
}

function authHeaders() {
  const token = getAdminToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response: Response) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong");
  }

  return result;
}

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminUsersResponse> {
  const query = buildQuery(params);

  const response = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}

export async function createAdminUser(payload: UserPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateAdminUser(id: string, payload: UserPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteAdminUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}