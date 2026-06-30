"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
} from "lucide-react";
import { updateUserProfile } from "@/lib/api/auth";
import "./password.css";

export default function PasswordUpdatePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const result = await updateUserProfile(formData);

      toast.success(result.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Password update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="password_page">
      <section className="password_shell">
        <header className="password_header">
          <Link href="/user/account" className="password_back_btn">
            <ArrowLeft size={24} />
          </Link>

          <h1>Update Password</h1>

          <div className="password_header_space" />
        </header>

        <section className="password_hero_card">
          <div className="password_icon">
            <ShieldCheck size={56} />
          </div>

          <h2>Secure Your Account</h2>
          <p>
            Create a strong password to keep your FreshCart account safe.
          </p>
        </section>

        <form className="password_card" onSubmit={handleSubmit}>
          <div className="password_form_group">
            <label>Current Password</label>

            <div className="password_input_wrapper">
              <Lock size={20} />

              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="password_form_group">
            <label>New Password</label>

            <div className="password_input_wrapper">
              <Lock size={20} />

              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="password_form_group">
            <label>Confirm New Password</label>

            <div className="password_input_wrapper">
              <Lock size={20} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="update_password_btn"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </main>
  );
}