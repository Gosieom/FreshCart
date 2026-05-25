import Link from "next/link";
import { Lock } from "lucide-react";
import "./reset_password.css";

export default function ResetPasswordPage() {
  return (
    <main className="reset_container">
      <section className="reset_card">
        <h1>Reset Password</h1>
        <p>Create a new password for your FreshCart account.</p>

        <form className="reset_form">
          <label>New Password</label>
          <div className="reset_input_wrapper">
            <Lock size={18} />
            <input type="password" placeholder="New password" />
          </div>

          <label>Confirm Password</label>
          <div className="reset_input_wrapper">
            <Lock size={18} />
            <input type="password" placeholder="Confirm password" />
          </div>

          <button type="submit">Reset Password</button>
        </form>

        <p className="reset_bottom">
          Back to <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}