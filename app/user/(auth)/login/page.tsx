"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/lib/validations/loginSchema";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/contexts/AuthContext";

import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const message = sessionStorage.getItem("accountCreatedMessage");

    if (message) {
      setSuccessMessage(message);
      sessionStorage.removeItem("accountCreatedMessage");

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    if (user.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/user/dashboard");
    }
  }, [user, loading, router]);

  const onSubmit = async (data: any) => {
    try {
      setError("");

      const response = await loginUser(data);

      const responseData = response?.data?.data || response?.data || response;

      const loggedInUser =
        responseData?.user ||
        response?.user ||
        response?.data?.user ||
        response?.data?.data?.user;

      const token =
        responseData?.token ||
        response?.token ||
        response?.data?.token ||
        response?.data?.data?.token;

      if (!loggedInUser) {
        throw new Error("Login response does not contain user data");
      }

      if (!token) {
        throw new Error("Login response does not contain token");
      }

      if (loggedInUser.role === "admin") {
        sessionStorage.setItem("adminToken", token);
        sessionStorage.setItem("adminUser", JSON.stringify(loggedInUser));

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(loggedInUser);
        router.replace("/admin/dashboard");
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");

        setUser(loggedInUser);
        router.replace("/user/dashboard");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <main className="login_container">
      <header className="login_header">
        <Image
          src="/freshcart-logo.png"
          alt="FreshCart Logo"
          width={120}
          height={80}
          priority
        />
      </header>

      <section className="login_main">
        <div className="login_left">
          <div className="login_visual_box">
            <div className="login_visual_content">
              <h2>Fresh groceries delivered with speed and care.</h2>
              <p>
                Shop fresh vegetables, fruits, and daily essentials from trusted
                local farms — delivered straight to your doorstep.
              </p>
            </div>
          </div>
        </div>

        <div className="login_right">
          <div className="login_card">
            <h2>Welcome Back</h2>

            {successMessage && (
              <p
                style={{
                  backgroundColor: "#e8f8ee",
                  color: "#16803c",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "16px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                {successMessage}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_group">
                <label>Email Address</label>

                <div className="input_wrapper">
                  <Mail size={18} className="input_icon" />

                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p className="error_text">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="form_group">
                <label>Password</label>

                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    className="password_toggle_btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="error_text">
                    {errors.password.message as string}
                  </p>
                )}

                <div className="forgot_password_row">
                  <Link href="/user/forgot-password">Forgot password?</Link>
                </div>
              </div>

              <button
                type="submit"
                className="login_submit_btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {error && <p className="error_text">{error}</p>}
            </form>

            <p className="signup_prompt">
              New to FreshCart?{" "}
              <Link href="/user/register">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}