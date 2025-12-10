import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import MiniLoader from "../../components/MiniLoader";
import toast from "react-hot-toast";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, published, draft
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${API_URL}/api/blogs/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setBlogs(blogs.filter((blog) => blog._id !== id));
          resolve();
        } else {
          reject();
        }
      } catch (error) {
        console.error("Failed to delete blog:", error);
        reject();
      }
    });

    toast.promise(promise, {
      loading: "Deleting blog post...",
      success: "Blog post deleted successfully!",
      error: "Failed to delete blog post",
    });
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "published" && blog.isPublished) ||
      (filter === "draft" && !blog.isPublished);

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.isPublished).length,
    drafts: blogs.filter((b) => !b.isPublished).length,
    totalViews: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Blog Management
            </h1>
            <p className="text-slate-400">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus size={20} />
            New Blog Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Posts</span>
              <Calendar className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Published</span>
              <Eye className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.published}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Drafts</span>
              <Edit className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.drafts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Views</span>
              <TrendingUp className="text-accent" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {["all", "published", "draft"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all capitalize ${
                    filter === filterType
                      ? "bg-accent text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {filterType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        {loading ? (
          <MiniLoader text="Loading blogs" size="lg" />
        ) : error ? (
          <div className="flex items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-slate-400 mb-4">No blog posts found</p>
            <Link
              to="/admin/blogs/new"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <Plus size={16} />
              Create your first blog post
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Title
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Category
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Author
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Status
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Views
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Date
                    </th>
                    <th className="text-left p-4 text-slate-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map((blog, index) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {blog.featuredImage && (
                            <img
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium line-clamp-1">
                              {blog.title}
                            </p>
                            <p className="text-slate-400 text-sm line-clamp-1">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{blog.category}</td>
                      <td className="p-4 text-slate-300">{blog.author}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            blog.isPublished
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{blog.views || 0}</td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {blog.isPublished && (
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-accent hover:bg-slate-700 rounded transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </a>
                          )}
                          <Link
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
