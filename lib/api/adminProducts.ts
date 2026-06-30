export type ProductStatus = "active" | "inactive";

export type AdminProduct = {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  unit: string;
  image: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProductMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminProductsResponse = {
  data: AdminProduct[];
  meta: ProductMeta;
};

export type ProductPayload = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  unit: string;
  status: ProductStatus;
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

function buildProductFormData(payload: ProductPayload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("category", payload.category);
  formData.append("stock", payload.stock);
  formData.append("unit", payload.unit);
  formData.append("status", payload.status);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export function getProductImageUrl(image?: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${SERVER_URL}${image}`;
}

export async function getAdminProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminProductsResponse> {
  const query = buildQuery(params);

  const response = await fetch(`${API_BASE_URL}/admin/products?${query}`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}

export async function createAdminProduct(payload: ProductPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: buildProductFormData(payload),
  });

  return handleResponse(response);
}

export async function updateAdminProduct(id: string, payload: ProductPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: authHeaders(),
    body: buildProductFormData(payload),
  });

  return handleResponse(response);
}

export async function deleteAdminProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}