"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Camera,
  ChevronRight,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
} from "lucide-react";

import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  removeUserProfileImage,
  updateUserProfile,
} from "@/lib/api/auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${BACKEND_URL}${image}`;
};

export default function AccountSettingsPage() {
  const { user, loading, setUser } = useAuth();

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
      setFullName(user.fullName || user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPreview(getImageUrl(user.profileImage));
    }
  }, [user]);

  const syncUser = (updatedUser: any) => {
    if (!updatedUser) return;

    setUser(updatedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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

      const updatedUser =
        result?.user || result?.data?.user || result?.data || null;

      if (updatedUser) {
        syncUser(updatedUser);
        setPreview(getImageUrl(updatedUser.profileImage));
      }

      setProfileImage(null);

      toast.success(result.message || "Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    if (profileImage && preview.startsWith("blob:")) {
      setProfileImage(null);
      setPreview(getImageUrl(user?.profileImage));
      return;
    }

    try {
      setIsRemoving(true);

      const result = await removeUserProfileImage();

      const updatedUser =
        result?.user || result?.data?.user || result?.data || null;

      if (updatedUser) {
        syncUser(updatedUser);
      }

      setProfileImage(null);
      setPreview("");

      toast.success(result.message || "Profile image removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove image");
    } finally {
      setIsRemoving(false);
    }
  };

  if (loading) {
    return (
      <AccountShell>
        <p className="account_loading">Loading account settings...</p>
      </AccountShell>
    );
  }

  if (!user) {
    return (
      <AccountShell>
        <p className="account_loading">Please login first.</p>
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <form className="insta_account_settings" onSubmit={handleSubmit}>
        <div className="insta_account_header">
          <h1>Account settings</h1>
          <p>Manage your FreshCart profile, contact details, and password.</p>
        </div>

        <section className="insta_settings_section">
          <h2>Profile photo</h2>

          <div className="insta_profile_photo_row">
            <div className="insta_profile_avatar">
              {preview ? (
                <img src={preview} alt="Profile preview" />
              ) : (
                <span>{fullName?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>

            <div className="insta_profile_photo_actions">
              <button
                type="button"
                className="insta_photo_change_btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
                Change photo
              </button>

              <button
                type="button"
                className="insta_photo_remove_btn"
                onClick={handleRemoveImage}
                disabled={isRemoving || (!preview && !profileImage)}
              >
                <Trash2 size={15} />
                {isRemoving ? "Removing..." : "Remove photo"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              <p>Choose a new photo, then click Save changes.</p>
            </div>
          </div>
        </section>

        <section className="insta_settings_section">
          <h2>Account information</h2>

          <div className="insta_settings_row">
            <div className="insta_settings_icon">
              <Mail size={22} />
            </div>

            <div className="insta_settings_content">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <span className="insta_change_text">Change</span>
          </div>
        </section>

        <section className="insta_settings_section">
          <h2>Personal information</h2>

          <div className="insta_settings_row">
            <div className="insta_settings_icon">
              <User size={22} />
            </div>

            <div className="insta_settings_content">
              <label>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>

            <span className="insta_change_text">Change</span>
          </div>

          <div className="insta_settings_row">
            <div className="insta_settings_icon">
              <Phone size={22} />
            </div>

            <div className="insta_settings_content">
              <label>Phone number</label>
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Add phone number"
              />
            </div>

            <span className="insta_change_text">Change</span>
          </div>
        </section>

        <section className="insta_settings_section">
          <h2>Delivery information</h2>

          <div className="insta_settings_row">
            <div className="insta_settings_icon">
              <MapPin size={22} />
            </div>

            <div className="insta_settings_content">
              <label>Preferred delivery location</label>
              <input value="Basundhara, Kathmandu" readOnly />
            </div>

            <span className="insta_change_text">Change</span>
          </div>
        </section>

        <section className="insta_settings_section">
          <h2>Security</h2>

          <Link href="/user/password" className="insta_password_row">
            <div className="insta_settings_icon">
              <Lock size={22} />
            </div>

            <div className="insta_settings_content">
              <label>Change password</label>
              <p>Update your password to keep your account secure.</p>
            </div>

            <ChevronRight size={24} />
          </Link>
        </section>

        <div className="insta_save_area">
          <button
            type="submit"
            className="insta_save_btn"
            disabled={isSubmitting}
          >
            <Save size={19} />
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </AccountShell>
  );
}