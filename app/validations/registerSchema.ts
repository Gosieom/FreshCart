import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});