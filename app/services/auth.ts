export const registerUser = async (data: any) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const loginUser = async (data: any) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const getLoggedInUser = async () => {
  const res = await fetch("/api/auth/whoami", {
    method: "GET",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Not logged in");
  }

  return result;
};

export const updateUserProfile = async (formData: FormData) => {
  const res = await fetch("/api/auth/update", {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Profile update failed");
  }

  return result;
};