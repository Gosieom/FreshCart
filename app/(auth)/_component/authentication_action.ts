"use server";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login action:", { email, password });

  return {
    success: true,
    message: "Login action completed",
  };
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Register action:", { fullName, email, password });

  return {
    success: true,
    message: "Register action completed",
  };
}