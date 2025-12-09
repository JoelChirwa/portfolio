import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Download, Trash2, TrendingUp, Users, UserX } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import MiniLoader from "../../components/MiniLoader";

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch subscribers
      const subsUrl =
        filter === "all"
          ? `${API_URL}/api/newsletter/subscribers`
          : `${API_URL}/api/newsletter/subscribers?status=${filter}`;

      const subsResponse = await fetch(subsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subsData = await subsResponse.json();

      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/newsletter/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();

      if (subsData.success) {
        setSubscribers(subsData.subscribers);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error("Error fetching newsletter data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const response = await fetch(
        `${API_URL}/api/newsletter/subscribers/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    }
  };

  const exportSubscribers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/newsletter/export`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting subscribers:", error);
    }
  };

  if (loading && !stats) {
    return (
      <AdminLayout>
        <MiniLoader text="Loading newsletter data" size="lg" />
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
              Newsletter Subscribers
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your email list and export contacts
            </p>
          </div>

          <button
            onClick={exportSubscribers}
            className="px-6 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p -6"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="text-accent" size={24} />
              </div>
              <p className="text-slate-400 text-sm">Total Subscribers</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.total}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Mail className="text-green-500" size={24} />
              </div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.active}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-blue-500" size={24} />
              </div>
              <p className="text-slate-400 text-sm">Last 30 Days</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.recentSubs}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <UserX className="text-red-500" size={24} />
              </div>
              <p className="text-slate-400 text-sm">Unsubscribed</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.unsubscribed}
              </p>
            </motion.div>
          </div>
        )}

        {/* Source Breakdown */}
        {stats?.bySource && stats.bySource.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Subscription Sources
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {stats.bySource.map((source, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-lg">
                  <p className="text-slate-400 text-sm capitalize">
                    {source._id}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {source.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-4">
          <label className="text-slate-400">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-accent"
          >
            <option value="active">Active Only</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Subscribers List */}
        {subscribers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Mail size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Subscribers Yet
            </h3>
            <p className="text-slate-400">
              Email subscribers will appear here when people sign up for your
              newsletter.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Subscribed
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber._id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-accent" />
                          <span className="text-white">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {subscriber.name || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full capitalize">
                          {subscriber.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${
                            subscriber.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(
                          subscriber.subscribedDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${subscriber.email}`}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Mail size={18} className="text-accent" />
                          </a>
                          <button
                            onClick={() => deleteSubscriber(subscriber._id)}
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

        {/* Growth Tips */}
        <div className="bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            📈 Grow Your Email List
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                Newsletter form is active on your footer (every page!)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                Add newsletter signup to blog posts when you create them
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>
                Offer a lead magnet: Free template, guide, or checklist
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">✓</span>
              <span>Mention newsletter in consultation follow-ups</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
