import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ImageUpload from "../../components/admin/ImageUpload";
import { useAuth } from "../../context/AuthContext";

const ProjectForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    description: "",
    longDescription: "",
    image: "",
    images: [],
    documents: [],
    tags: "",
    date: new Date().toISOString().split('T')[0],
    featured: false,
    githubUrl: "",
    liveUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`);
      const data = await response.json();

      if (data.success) {
        const project = data.project;
        setFormData({
          title: project.title,
          category: project.category,
          description: project.description,
          longDescription: project.longDescription,
          image: project.image,
          images: project.images || [],
          documents: project.documents || [],
          tags: project.tags?.join(", ") || "",
          date: project.date ? new Date(project.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          featured: project.featured,
          githubUrl: project.githubUrl || "",
          liveUrl: project.liveUrl || "",
          clientName: project.clientName || "",
          isAnonymous: project.isAnonymous || false,
        });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddImage = (url) => {
    if (formData.images.length < 5) {
      setFormData({
        ...formData,
        images: [...formData.images, url]
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingDoc(true);
    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      if (data.success) {
        setFormData({
          ...formData,
          documents: [...formData.documents, {
            url: data.url,
            name: file.name,
            type: file.type
          }]
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRemoveDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = isEditing
        ? `${API_URL}/api/projects/${id}`
        : `${API_URL}/api/projects`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/admin/projects");
        }, 1500);
      } else {
        setError(data.message || "Failed to save project");
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
            onClick={() => navigate("/admin/projects")}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h1>
            <p className="text-slate-400">
              {isEditing
                ? "Update project details"
                : "Add a new project to your portfolio"}
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
            <span>Project saved successfully! Redirecting...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="E-Commerce Platform"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
              >
                <option>Web Development</option>
                <option>Academic Services</option>
                <option>Grant Writing</option>
                <option>Data Entry</option>
                <option>PDF/Image Conversion</option>
                <option>Microsoft Word Services</option>
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="2"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="Brief one-liner about the project"
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="Detailed project description, challenges, solutions, etc."
              />
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Featured Image *
              </label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            {/* Additional Images (up to 5) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Additional Images ({formData.images.length}/5)
              </label>
              <div className="space-y-4">
                {formData.images.length < 5 && (
                  <ImageUpload
                    value=""
                    onChange={handleAddImage}
                  />
                )}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Project ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Documents (PDF, DOC, EXCEL)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleDocumentUpload}
                disabled={uploadingDoc}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-slate-900 file:font-medium hover:file:bg-accent/90"
              />
              {uploadingDoc && (
                <p className="text-xs text-slate-400 mt-2">Uploading document...</p>
              )}
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <span className="text-sm text-slate-300">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                placeholder="React, Node.js, MongoDB"
              />
              <p className="text-xs text-slate-500 mt-2">
                Separate tags with commas
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Client Info & Anonymity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="Client Name (Optional)"
                />
              </div>
              <div className="flex items-center h-full pt-6">
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
                    Keep Client Anonymous
                  </label>
                </div>
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 bg-slate-950 border-slate-800 rounded text-accent focus:ring-accent"
              />
              <label
                htmlFor="featured"
                className="text-slate-300 cursor-pointer"
              >
                Mark as featured project
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
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
                  {isEditing ? "Update Project" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProjectForm;
