export type CategoryStatus = "active" | "inactive";

export type AdminCategory = {
  id: string;
  _id: string;
  name: string;
  description: string;
  image: string;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export type CategoryMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminCategoriesResponse = {
  data: AdminCategory[];
  meta: CategoryMeta;
};

export type CategoryPayload = {
  name: string;
  description: string;
  status: CategoryStatus;
  image?: File | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

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

function buildCategoryFormData(payload: CategoryPayload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("status", payload.status);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export function getCategoryImageUrl(image?: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${SERVER_URL}${image}`;
}

export async function getAdminCategories(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminCategoriesResponse> {
  const query = buildQuery(params);

  const response = await fetch(`${API_BASE_URL}/admin/categories?${query}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}

export async function createAdminCategory(payload: CategoryPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: buildCategoryFormData(payload),
  });

  return handleResponse(response);
}

export async function updateAdminCategory(
  id: string,
  payload: CategoryPayload
) {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: buildCategoryFormData(payload),
  });

  return handleResponse(response);
}

export async function deleteAdminCategory(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}