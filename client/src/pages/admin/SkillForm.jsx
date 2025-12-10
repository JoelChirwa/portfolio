import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const SkillForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "Web Development",
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills/${id}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.skill.name,
          level: data.skill.level,
          category: data.skill.category,
          order: data.skill.order,
        });
      }
    } catch (error) {
      console.error("Error fetching skill:", error);
      setError("Failed to load skill");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const url = isEditing
        ? `${API_URL}/api/skills/${id}`
        : `${API_URL}/api/skills`;

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
          navigate("/admin/skills");
        }, 1500);
      } else {
        setError(data.message || "Failed to save skill");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/skills")}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Edit Skill" : "Add New Skill"}
            </h1>
            <p className="text-slate-400">
              {isEditing
                ? "Update skill details"
                : "Add a new skill to your portfolio"}
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
            <span>Skill saved successfully! Redirecting...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Skill Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="e.g. React.js"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="e.g. Web Development"
                list="categories"
              />
              <datalist id="categories">
                <option value="Web Development" />
                <option value="Academic Services" />
                <option value="Grant Writing" />
                <option value="Tools & Software" />
              </datalist>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Proficiency Level ({formData.level}%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <span className="text-accent font-bold w-12">
                  {formData.level}%
                </span>
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/skills")}
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
                  {isEditing ? "Update Skill" : "Create Skill"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SkillForm;
