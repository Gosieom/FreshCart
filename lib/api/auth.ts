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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch("/api/auth/whoami", {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Not logged in");
  }

  return result;
};

export const updateUserProfile = async (formData: FormData) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch("/api/auth/update", {
    method: "PATCH",
    credentials: "include",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    console.log("Profile update error:", result);
    throw new Error(result.message || "Profile update failed");
  }

  return result;
};

export const removeUserProfileImage = async () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch("/api/auth/profile-image", {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Profile image remove failed");
  }

  return result;
};

export const requestPasswordReset = async (email: string) => {
  const res = await fetch("/api/auth/request-password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to send reset email");
  }

  return result;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ newPassword }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to reset password");
  }

  return result;
};