export type Product = {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  unit: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function getProductImageUrl(image?: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `${SERVER_URL}${image}`;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();

  query.set("page", String(params?.page || 1));
  query.set("limit", String(params?.limit || 12));

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.category?.trim()) {
    query.set("category", params.category.trim());
  }

  const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result;
}