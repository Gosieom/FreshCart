"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { updateUserProfile } from "@/app/services/auth";
import Link from "next/link";

const BACKEND_URL = "http://localhost:5000";

export default function ProfilePage() {
  const { user, loading, refreshUser, setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

      if (user.profileImage) {
        setPreview(`${BACKEND_URL}${user.profileImage}`);
      }
    }
  }, [user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const result = await updateUserProfile(formData);

      setUser(result.user);
      await refreshUser();

      toast.success(result.message || "Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  }

  if (!user) {
    return <p style={{ padding: "2rem" }}>Please login first.</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>User Profile Update</h1>
      <p>Update your account details and profile image.</p>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Image
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              border: "1px solid #ccc",
            }}
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
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/user/password">Change password</Link>
        <br />
        <Link href="/user/dashboard">Back to dashboard</Link>
      </div>
    </main>
  );
}