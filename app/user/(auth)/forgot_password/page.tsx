import Link from "next/link";
import { Mail } from "lucide-react";
import "./forgot_password.css";

export default function ForgotPasswordPage() {
  return (
    <main className="forgot_container">
      <section className="forgot_card">
        <h1>Forgot Password?</h1>
        <p>
          Enter your email address and we will send you instructions to reset
          your password.
        </p>

        <form className="forgot_form">
          <label>Email Address</label>
          <div className="forgot_input_wrapper">
            <Mail size={18} />
            <input type="email" placeholder="you@gmail.com" />
          </div>

          <button type="submit">Send Reset Link</button>
        </form>

        <p className="forgot_bottom">
          Remember your password? <Link href="/login">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}