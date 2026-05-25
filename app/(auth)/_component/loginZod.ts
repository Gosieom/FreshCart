"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "./login_register_schema";

export default function loginZod() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data:", data);
    alert("Login form submitted successfully!");
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}