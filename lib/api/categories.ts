export type Category = {
  id: string;
  _id: string;
  name: string;
  description: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type CategoriesResponse = {
  data: Category[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function getCategoryImageUrl(image?: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `${SERVER_URL}${image}`;
}

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch categories");
  }

  return result;
}