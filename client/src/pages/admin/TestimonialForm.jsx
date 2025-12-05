import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, AlertCircle, CheckCircle, Star } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUpload from "../../components/admin/ImageUpload";
import { useAuth } from "../../context/AuthContext";

const TestimonialForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const testimonial = data.find((t) => t._id === id);

      if (testimonial) {
        setFormData({
          name: testimonial.name,
          role: testimonial.role,
          text: testimonial.text,
          rating: testimonial.rating,
          image: testimonial.image,
          rating: testimonial.rating,
          image: testimonial.image,
          isActive: testimonial.isActive,
          isAnonymous: testimonial.isAnonymous || false,
        });
      }
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      setError("Failed to load testimonial");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const url = isEditing
        ? `${API_URL}/api/testimonials/${id}`
        : `${API_URL}/api/testimonials`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/admin/testimonials");
        }, 1500);
      } else {
        setError(data.message || "Failed to save testimonial");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/testimonials")}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Edit Testimonial" : "Add Testimonial"}
            </h1>
            <p className="text-slate-400">
              {isEditing ? "Update client feedback" : "Add new client feedback"}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
            <CheckCircle size={20} />
            <span>Testimonial saved successfully! Redirecting...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Name & Role */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role/Title *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="CEO, Tech Corp"
                />
              </div>
            </div>

            {/* Testimonial Text */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Feedback *
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="Great service! Highly recommended."
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rating (1-5) *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="rating"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full max-w-xs accent-accent"
                />
                <div className="flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  <span className="font-bold text-white">
                    {formData.rating}
                  </span>
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Image */}
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 bg-slate-950 border-slate-800 rounded text-accent focus:ring-accent"
              />
              <label
                htmlFor="isActive"
                className="text-slate-300 cursor-pointer"
              >
                Visible on website
              </label>
            </div>
            {/* Anonymous Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous || false}
                onChange={handleChange}
                className="w-5 h-5 bg-slate-950 border-slate-800 rounded text-accent focus:ring-accent"
              />
              <label
                htmlFor="isAnonymous"
                className="text-slate-300 cursor-pointer"
              >
                Make Anonymous (Hide Name/Photo)
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/testimonials")}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? "Update Testimonial" : "Create Testimonial"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TestimonialForm;
