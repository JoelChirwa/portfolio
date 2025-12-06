import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Camera, Save, Loader } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminSettings = () => {
  const { admin, token, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: admin?.username || "",
    email: admin?.email || "",
    avatar: admin?.avatar || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, avatar: data.imageUrl });
        setMessage({ type: "success", text: "Image uploaded successfully" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to upload image",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ type: "error", text: "Error uploading image" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate passwords if trying to change
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "Password must be at least 6 characters",
        });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/admin/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            avatar: formData.avatar,
            password: formData.newPassword || undefined,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profile updated successfully" });
        refreshProfile();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">
            Manage your account settings and preferences.
          </p>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-accent" />
              Profile Details
            </h2>

            <div className="space-y-6">
              {/* Avatar Input (URL for now) */}
              <div>
                <label className="block text-slate-400 mb-2 text-sm">
                  Profile Picture
                </label>
                <div className="flex gap-4 items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-slate-700 group-hover:border-accent transition-colors">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={32} className="text-slate-500" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-accent text-slate-900 p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors shadow-lg">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-slate-300 font-medium mb-1">
                      Upload New Picture
                    </p>
                    <p className="text-xs text-slate-500 mb-3">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors border border-slate-700">
                      <Camera size={16} />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 mb-2 text-sm">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={20} className="text-accent" />
              Security
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-2 text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2 text-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
