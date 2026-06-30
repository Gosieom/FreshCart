"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/registerSchema";
import { registerUser } from "@/lib/api/auth";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterSubmit = async (data: any) => {
    try {
      setError("");

      await registerUser(data);

      sessionStorage.setItem(
        "accountCreatedMessage",
        "Account created successfully!"
      );

      router.push("/user/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <main className="register_container">
      <header className="register_header">
        <Image
          src="/freshcart-logo.png"
          alt="FreshCart Logo"
          width={120}
          height={80}
          className="freshcart_logo_img"
          priority
        />
      </header>

      <section className="register_main">
        <div className="register_left">
          <div className="register_visual_box">
            <div className="register_visual_content">
              <h2>Fresh groceries delivered with speed and care.</h2>
              <p>
                Shop fresh vegetables, fruits, and daily essentials from trusted
                local farms — delivered straight to your doorstep.
              </p>
            </div>
          </div>
        </div>

        <div className="register_right">
          <div className="register_card">
            <h2>Create Account</h2>

            <form
              onSubmit={handleSubmit(handleRegisterSubmit)}
              className="register_form"
            >
              <div className="form_group">
                <label>Full Name</label>
                <div className="input_wrapper">
                  <User size={18} className="input_icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="error_text">
                    {errors.fullName.message as string}
                  </p>
                )}
              </div>

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
                <label>Phone Number</label>
                <div className="input_wrapper">
                  <Phone size={18} className="input_icon" />
                  <input
                    type="text"
                    placeholder="+977-98XXXXXXXX"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="error_text">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>

              <div className="form_group">
                <label>Password</label>
                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    className="password_toggle_btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="error_text">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <div className="form_group">
                <label>Confirm Password</label>
                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    className="password_toggle_btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error_text">
                    {errors.confirmPassword.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="register_submit_btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              {error && <p className="error_text">{error}</p>}
            </form>

            <p className="login_prompt">
              Already have an account?{" "}
              <Link href="/user/login">Login here</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}