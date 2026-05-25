"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import loginZod from "../_component/loginZod";
import "./login.css";

export default function LoginPage() {
  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting },
  } = loginZod();

  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // useEffect(() => {
  //   const message = sessionStorage.getItem("accountCreatedMessage");

  //   if (message) {
  //     setPopupMessage(message);
  //     sessionStorage.removeItem("accountCreatedMessage");

  //     const timer = setTimeout(() => {
  //       setPopupMessage("");
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  return (
    <main className="login_container">
      {popupMessage && (
        <div className="success_popup">
          {popupMessage}
        </div>
      )}

      <header className="login_header">
         
          <Image
            src="/freshcart-logo.png"
            alt="FreshCart Logo"
            width={120}
            height={80}
            className="freshcart_logo_img"
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

            <p className="login_subtitle">
              Log in to your account to continue shopping.
            </p>

            <form onSubmit={onSubmit}>
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
                  <p className="error_text">{errors.email.message}</p>
                )}
              </div>

              <div className="form_group">
                <div className="password_header">
                  <label>Password</label>
                </div>

                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                  <p className="error_text">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="login_submit_btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <Link href="/forgot_password" className="forgot_link">
                Forgot Password?
              </Link>
            </form>

            <p className="signup_prompt">
              New to FreshCart? <Link href="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}