"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token") || "";
    setToken(resetToken);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      if (!token) {
        setError("Reset token is missing. Please use the link from your email.");
        return;
      }

      if (!password || !confirmPassword) {
        setError("Please fill in both fields.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);

      const response = await resetPassword(token, password);

      setMessage(response.message || "Password reset successfully.");

      setTimeout(() => {
        router.push("/user/login");
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="reset_password_container">
      <section className="reset_password_card">
        <Link href="/user/login" className="reset_password_back">
          <ArrowLeft size={18} />
          Back to login
        </Link>

        <h1>Reset Password</h1>
        <p>Create a new password for your FreshCart account.</p>

        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label>New Password</label>

            <div className="input_wrapper">
              <Lock size={18} className="input_icon" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="password_toggle_btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form_group">
            <label>Confirm Password</label>

            <div className="input_wrapper">
              <Lock size={18} className="input_icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              <button
                type="button"
                className="password_toggle_btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="error_text">{error}</p>}
          {message && <p className="success_text">{message}</p>}

          <button
            type="submit"
            className="reset_password_btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
}