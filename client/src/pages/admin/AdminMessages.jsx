import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2, Check, Filter, Search, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data.submissions || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/contact-submissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setMessages(messages.map((m) => (m._id === id ? { ...m, status } : m)));
        if (selectedMessage?._id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/contact-submissions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m._id !== id));
        setDeleteModal(null);
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const filteredMessages = messages
    .filter((m) => filter === "all" || m.status === filter)
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "read":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "replied":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "archived":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-slate-400">
            View and manage contact form submissions
          </p>
        </div>

        {/* Filters */}
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
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* Status Filter */}
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
                <option value="all">All Messages</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Mail size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No messages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white">{message.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded border ${getStatusColor(
                          message.status
                        )}`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-1">
                      {message.email} • {message.service}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal(message);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-slate-300 line-clamp-2">{message.message}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-slate-400">{selectedMessage.email}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">
                    Service Interest
                  </p>
                  <p className="text-white">{selectedMessage.service}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Date</p>
                  <p className="text-white">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Message</p>
                  <p className="text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="border-t border-slate-800 pt-6">
                <p className="text-sm text-slate-400 mb-3">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {["new", "read", "replied", "archived"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedMessage._id, status)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        selectedMessage.status === status
                          ? "bg-accent text-slate-900"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
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
                Delete Message?
              </h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to delete this message from{" "}
                {deleteModal.name}? This action cannot be undone.
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

export default AdminMessages;
