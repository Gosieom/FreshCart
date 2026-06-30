"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { requestPasswordReset } from "@/lib/api/auth";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      if (!email.trim()) {
        setError("Email is required.");
        return;
      }

      setIsSubmitting(true);

      const response = await requestPasswordReset(email.trim());

      setMessage(
        response.message || "Password reset link has been sent to your email."
      );
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="forgot_container">
      <section className="forgot_card">
        <h1>Forgot Password?</h1>

        <p>
          Enter your email address and we will send you instructions to reset
          your password.
        </p>

        <form className="forgot_form" onSubmit={handleSubmit}>
          <label>Email Address</label>

          <div className="forgot_input_wrapper">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && <p className="error_text">{error}</p>}
          {message && <p className="success_text">{message}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="forgot_bottom">
          Remember your password? <Link href="/user/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}