const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("adminToken");
}

function authHeaders() {
  const token = getToken();

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

export async function getAdminDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });

  return handleResponse(response);
}