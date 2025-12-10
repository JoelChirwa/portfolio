import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  Calendar,
  User,
  FileText,
  Globe,
  Hash,
  AlignLeft,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Joel Chirwa",
    category: "Web Development",
    tags: [],
    featuredImage: "",
    isPublished: false,
    readTime: 5,
    // SEO Fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
  });

  const [tagInput, setTagInput] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  const categories = [
    "Web Development",
    "Academic Services",
    "Grant Writing",
    "Freelancing Tips",
    "Technology",
    "Business",
    "Other",
  ];

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !id) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, id]);

  // Auto-populate SEO fields if empty
  useEffect(() => {
    if (!formData.metaTitle && formData.title) {
      setFormData((prev) => ({ ...prev, metaTitle: formData.title }));
    }
    if (!formData.metaDescription && formData.excerpt) {
      setFormData((prev) => ({ ...prev, metaDescription: formData.excerpt }));
    }
  }, [formData.title, formData.excerpt]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/blogs/admin/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setFormData({
          ...data.blog,
          metaTitle: data.blog.metaTitle || "",
          metaDescription: data.blog.metaDescription || "",
          metaKeywords: data.blog.metaKeywords || "",
          tags: data.blog.tags || [],
        });
      } else {
        toast.error("Failed to load blog details");
        navigate("/admin/blogs");
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setImageUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      // Get token from localStorage for authorization
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      console.log("Upload response:", response.status, data);

      if (data.success) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        console.error("Upload failed:", data);
        toast.error(data.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setLoading(true);

    const blogData = {
      ...formData,
      isPublished: publish,
    };

    try {
      const url = id ? `${API_URL}/api/blogs/${id}` : `${API_URL}/api/blogs`;
      const method = id ? "PUT" : "POST";

      // Get token from localStorage
      const token = localStorage.getItem("adminToken");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Blog ${publish ? "published" : "saved as draft"} successfully!`
        );
        navigate("/admin/blogs");
      } else {
        toast.error(data.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Quill modules configuration with image handler
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("image", file);

            try {
              // Get token from localStorage
              const token = localStorage.getItem("adminToken");

              const response = await fetch(`${API_URL}/api/upload/image`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });

              const data = await response.json();
              if (data.success) {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, "image", data.url);
                toast.success("Image inserted!");
              } else {
                toast.error("Failed to upload image");
              }
            } catch (error) {
              console.error("Image upload error:", error);
              toast.error("Failed to upload image");
            }
          };
        },
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "script",
    "indent",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/admin/blogs")}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-accent transition-colors mb-2"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </button>
            <h1 className="text-3xl font-bold text-white">
              {id ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Eye size={18} />
              {showPreview ? "Hide" : "Show"} Preview
            </button>
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              <Globe size={18} />
              Publish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText size={20} className="text-accent" />
                Basic Information
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter blog title..."
                  required
                />
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors font-mono text-sm"
                  placeholder="blog-url-slug"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  URL: /blog/{formData.slug || "your-slug-here"}
                </p>
              </div>

              {/* Excerpt */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors resize-none"
                  rows={3}
                  placeholder="Brief description for preview..."
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.excerpt.length}/200 characters
                </p>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlignLeft size={20} className="text-accent" />
                Content
              </h2>

              <div className="quill-editor-wrapper">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog content here..."
                  className="bg-slate-800 text-white rounded-lg"
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={20} className="text-accent" />
                SEO Settings
              </h2>

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                  placeholder="SEO title for search engines..."
                  maxLength={60}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.metaTitle.length}/60 characters (optimal)
                </p>
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors resize-none"
                  rows={3}
                  placeholder="SEO description for search results..."
                  maxLength={160}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.metaDescription.length}/160 characters (optimal)
                </p>
              </div>

              {/* Meta Keywords */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                  placeholder="keyword1, keyword2, keyword3..."
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Social Share Image (OG Image)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.ogImage}
                    onChange={(e) =>
                      setFormData({ ...formData, ogImage: e.target.value })
                    }
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                    placeholder="https://..."
                  />
                  <label className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-accent hover:border-accent transition-colors cursor-pointer flex items-center gap-2">
                    <ImageIcon size={18} />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "ogImage")}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.ogImage && (
                  <img
                    src={formData.ogImage}
                    alt="OG preview"
                    className="mt-3 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-accent" />
                Featured Image *
              </h3>

              {formData.featuredImage ? (
                <div className="relative group">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <button
                    onClick={() =>
                      setFormData({ ...formData, featuredImage: "" })
                    }
                    className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block w-full h-48 border-2 border-dashed border-slate-700 rounded-lg hover:border-accent transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-accent">
                  <ImageIcon size={32} />
                  <span>
                    {imageUploading ? "Uploading..." : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "featuredImage")}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
              )}

              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-accent transition-colors mt-3"
                placeholder="Or paste image URL..."
              />
            </div>

            {/* Metadata */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Metadata</h3>

              {/* Author */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2 flex items-center gap-2">
                  <User size={16} />
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2 flex items-center gap-2">
                  <Tag size={16} />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Read Time */}
              <div className="mb-4">
                <label className="block text-slate-300 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readTime: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                  min={1}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Hash size={18} className="text-accent" />
                Tags
              </h3>

              <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Add a tag..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-slate-900 font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Add
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
            >
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="p-8">
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt={formData.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <div className="mb-4">
                  <span className="text-accent text-sm font-medium">
                    {formData.category}
                  </span>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  {formData.title || "Untitled Post"}
                </h1>

                <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
                  <span>{formData.author}</span>
                  <span>•</span>
                  <span>{formData.readTime} min read</span>
                </div>

                <p className="text-slate-300 text-lg mb-8">
                  {formData.excerpt}
                </p>

                <div
                  className="prose prose-invert prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />

                {formData.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;
