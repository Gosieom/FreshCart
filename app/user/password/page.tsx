"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { updateUserProfile } from "@/app/services/auth";

export default function PasswordUpdatePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <main style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Update Password</h1>
      <p>Change your account password.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px 20px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/user/profile">Back to profile</Link>
      </div>
    </main>
  );
}