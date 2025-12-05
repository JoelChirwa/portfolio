import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Star, Search, Filter } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const categories = [
    "All",
    "Web Development",
    "Academic Services",
    "Grant Writing",
    "Data Entry",
    "PDF/Image Conversion",
    "Microsoft Word Services",
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        setDeleteModal(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projects
    .filter((p) => filter === "All" || p.category === filter)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading projects...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-slate-400">Manage your portfolio projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus size={20} />
            Add Project
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 mb-4">No projects found</p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              <Plus size={18} />
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-accent/50 transition-colors"
              >
                {/* Project Image */}
                <div className="relative aspect-video">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-accent text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-accent">{project.category}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags?.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/projects/edit/${project._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteModal(project)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Delete Project?
              </h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to delete "{deleteModal.title}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
