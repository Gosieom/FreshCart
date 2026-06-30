"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Settings,
  Heart,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Save,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  removeUserProfileImage,
  updateUserProfile,
} from "@/lib/api/auth";
import "./profile.css";

const BACKEND_URL = "http://localhost:5000";

const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${BACKEND_URL}${image}`;
};

export default function ProfilePage() {
  const { user, loading, setUser, refreshUser, logout } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPreview(getImageUrl(user.profileImage));
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

      if (result.user) {
        setUser(result.user);
      }

      setProfileImage(null);
      await refreshUser();

      toast.success(result.message || "Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemoving(true);

      const result = await removeUserProfileImage();

      if (result.user) {
        setUser(result.user);
      }

      setProfileImage(null);
      setPreview("");
      await refreshUser();

      toast.success(result.message || "Profile image removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove image");
    } finally {
      setIsRemoving(false);
    }
  };

  if (loading) {
    return <p className="profile_loading">Loading profile...</p>;
  }

  if (!user) {
    return <p className="profile_loading">Please login first.</p>;
  }

  return (
    <main className="profile_page">
      <section className="profile_shell">
        <header className="profile_header">
          <Link href="/user/dashboard" className="profile_back_btn">
            <ArrowLeft size={24} />
          </Link>

          <h1>My Account</h1>

          <div className="profile_header_space" />
        </header>

        <section className="profile_hero_card">
          <div className="profile_avatar">
            {preview ? (
              <img src={preview} alt="Profile" />
            ) : (
              <span>{user.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>

          <h2>{user.fullName}</h2>
          <p>{user.email}</p>

          <div className="profile_image_actions">
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              <Edit3 size={18} />
              Change
            </button>

            <button
              type="button"
              className="remove_btn"
              onClick={handleRemoveImage}
              disabled={isRemoving}
            >
              <Trash2 size={18} />
              {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </section>

        <form className="profile_update_card" onSubmit={handleSubmit}>
          <h2>Profile Details</h2>

          <div className="profile_form_grid">
            <div className="profile_form_group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="profile_form_group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="profile_form_group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <button
            type="submit"
            className="save_profile_btn"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <section className="account_section">
          <h3>Account</h3>

          <Link href="/user/password" className="account_menu_card">
            <div className="account_menu_icon green">
              <Settings size={24} />
            </div>

            <div>
              <h4>Settings</h4>
              <p>Change password and manage account</p>
            </div>

            <ChevronRight size={22} />
          </Link>

          <div className="account_menu_card">
            <div className="account_menu_icon green">
              <Heart size={24} />
            </div>

            <div>
              <h4>Wishlist</h4>
              <p>View your saved items</p>
            </div>

            <ChevronRight size={22} />
          </div>

          <div className="account_menu_card">
            <div className="account_menu_icon green">
              <ShoppingBag size={24} />
            </div>

            <div>
              <h4>My Orders</h4>
              <p>View your order history</p>
            </div>

            <ChevronRight size={22} />
          </div>
        </section>

        <section className="account_section">
          <h3>Session</h3>

          <button className="account_menu_card logout_card" onClick={logout}>
            <div className="account_menu_icon red">
              <LogOut size={24} />
            </div>

            <div>
              <h4>Logout</h4>
              <p>Sign out from your account</p>
            </div>

            <ChevronRight size={22} />
          </button>
        </section>
      </section>
    </main>
  );
}