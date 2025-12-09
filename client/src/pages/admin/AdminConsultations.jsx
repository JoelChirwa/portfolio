import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import MiniLoader from "../../components/MiniLoader";

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchConsultations();
  }, [filter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? `${API_URL}/api/consultations`
          : `${API_URL}/api/consultations?status=${filter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/consultations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchConsultations();
        if (selectedConsultation?._id === id) {
          setSelectedConsultation({
            ...selectedConsultation,
            status: newStatus,
          });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteConsultation = async (id) => {
    if (!confirm("Are you sure you want to delete this consultation request?"))
      return;

    try {
      const response = await fetch(`${API_URL}/api/consultations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchConsultations();
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Error deleting consultation:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      completed: "bg-green-500/10 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
    };
    return colors[status] || colors.new;
  };

  if (loading && consultations.length === 0) {
    return (
      <AdminLayout>
        <MiniLoader text="Loading consultations" size="lg" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Consultation Requests
            </h1>
            <p className="text-slate-400 mt-1">
              Manage and respond to consultation bookings
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["new", "contacted", "scheduled", "completed"].map((status) => (
            <div
              key={status}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <p className="text-slate-400 text-sm capitalize">{status}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {consultations.filter((c) => c.status === status).length}
              </p>
            </div>
          ))}
        </div>

        {/* Consultations List */}
        {consultations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Calendar size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Consultations Yet
            </h3>
            <p className="text-slate-400">
              Consultation requests will appear here when visitors book
              appointments.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Project Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Budget
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Timeline
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {consultations.map((consultation) => (
                    <tr
                      key={consultation._id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {consultation.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {consultation.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {consultation.projectType}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {consultation.budget || "Not specified"}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {consultation.timeline}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={consultation.status}
                          onChange={(e) =>
                            updateStatus(consultation._id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                            consultation.status
                          )}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(consultation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setShowDetails(true);
                            }}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} className="text-accent" />
                          </button>
                          <button
                            onClick={() => deleteConsultation(consultation._id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Consultation Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <p className="text-white font-medium">
                    {selectedConsultation.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <p className="text-white">{selectedConsultation.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Phone</label>
                  <p className="text-white">
                    {selectedConsultation.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Project Type</label>
                  <p className="text-white">
                    {selectedConsultation.projectType}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Budget</label>
                  <p className="text-white">
                    {selectedConsultation.budget || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Timeline</label>
                  <p className="text-white">{selectedConsultation.timeline}</p>
                </div>
                {selectedConsultation.preferredDate && (
                  <div>
                    <label className="text-sm text-slate-400">
                      Preferred Date
                    </label>
                    <p className="text-white">
                      {new Date(
                        selectedConsultation.preferredDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedConsultation.preferredTime && (
                  <div>
                    <label className="text-sm text-slate-400">
                      Preferred Time
                    </label>
                    <p className="text-white">
                      {selectedConsultation.preferredTime}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Project Description
                </label>
                <p className="text-white mt-1 whitespace-pre-wrap">
                  {selectedConsultation.description}
                </p>
              </div>

              {selectedConsultation.hearAboutUs && (
                <div>
                  <label className="text-sm text-slate-400">
                    How they heard about you
                  </label>
                  <p className="text-white">
                    {selectedConsultation.hearAboutUs}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <label className="text-sm text-slate-400">Submitted</label>
                <p className="text-white">
                  {new Date(selectedConsultation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selectedConsultation.email}`}
                className="flex-1 px-4 py-2 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors text-center"
              >
                Send Email
              </a>
              {selectedConsultation.phone && (
                <a
                  href={`tel:${selectedConsultation.phone}`}
                  className="flex-1 px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors text-center"
                >
                  Call
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminConsultations;
