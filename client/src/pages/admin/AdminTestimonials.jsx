import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <button
            onClick={() => navigate("/admin/testimonials/new")}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus size={20} />
            Add Testimonial
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-lg border border-slate-800">
                No testimonials found.
              </div>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-slate-700">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">
                        {testimonial.name}
                      </h3>
                      <span className="text-sm text-slate-400 px-2 py-0.5 bg-slate-800 rounded-full">
                        {testimonial.role}
                      </span>
                      {!testimonial.isActive && (
                        <span className="text-xs text-red-400 border border-red-400/30 px-2 py-0.5 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-700"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-slate-300 line-clamp-2">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/testimonials/edit/${testimonial._id}`)
                      }
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
