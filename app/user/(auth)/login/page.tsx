"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from '../../../api/auth';
import { loginSchema } from '../../../validations/loginSchema';
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser(data);

      // Save JWT token
      localStorage.setItem("token", response.token); // <-- store the token

      // Redirect to nested dashboard route
      router.push("/user/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="login_container">
      <header className="login_header">
        <Image src="/freshcart-logo.png" alt="FreshCart Logo" width={120} height={80} priority />
      </header>

      <section className="login_main">
        <div className="login_left">
          <div className="login_visual_box">
            <div className="login_visual_content">
              <h2>Fresh groceries delivered with speed and care.</h2>
              <p>Shop fresh vegetables, fruits, and daily essentials from trusted local farms — delivered straight to your doorstep.</p>
            </div>
          </div>
        </div>

        <div className="login_right">
          <div className="login_card">
            <h2>Welcome Back</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_group">
                <label>Email Address</label>
                <div className="input_wrapper">
                  <Mail size={18} className="input_icon" />
                  <input type="email" placeholder="you@gmail.com" {...register("email")} />
                </div>
                {errors.email && <p className="error_text">{errors.email.message}</p>}
              </div>

              <div className="form_group">
                <label>Password</label>
                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />
                  <input type={showPassword ? "text" : "password"} placeholder="Enter password" {...register("password")} />
                  <button type="button" className="password_toggle_btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="error_text">{errors.password.message}</p>}
              </div>

              <button type="submit" className="login_submit_btn" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {error && <p className="error_text">{error}</p>}
            </form>

            <p className="signup_prompt">
              New to FreshCart? <Link href="/user/register">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}