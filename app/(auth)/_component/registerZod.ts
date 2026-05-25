"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "./login_register_schema";

export default function registerZod() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register data:", data);
    alert("Registration form submitted successfully!");
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}