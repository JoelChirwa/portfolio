import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Mail,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, featured: 0 },
    messages: { total: 0, new: 0, read: 0, replied: 0 },
  });

  const [loading, setLoading] = useState(true);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const projectsRes = await fetch(`${API_URL}/api/projects`);
      const projectsData = await projectsRes.json();

      // Fetch messages stats
      const messagesStatsRes = await fetch(
        `${API_URL}/api/contact-submissions/stats/overview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const messagesStatsData = await messagesStatsRes.json();

      /* Removed recent messages fetch */

      setStats({
        projects: {
          total: projectsData.count || 0,
          featured:
            projectsData.projects?.filter((p) => p.featured).length || 0,
        },
        messages: messagesStatsData.stats || {
          total: 0,
          new: 0,
          read: 0,
          replied: 0,
        },
      });

      /* Removed setRecentMessages */
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats.projects.total,
      icon: <FolderOpen size={24} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      link: "/admin/projects",
    },
    {
      title: "Featured Projects",
      value: stats.projects.featured,
      icon: <TrendingUp size={24} />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      link: "/admin/projects",
    },
    {
      title: "Total Messages",
      value: stats.messages.total,
      icon: <Mail size={24} />,
      color: "text-green-400",
      bg: "bg-green-400/10",
      link: "/admin/messages",
    },
    {
      title: "New Messages",
      value: stats.messages.new,
      icon: <AlertCircle size={24} />,
      color: "text-red-400",
      bg: "bg-red-400/10",
      link: "/admin/messages",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Welcome back! Here's your portfolio overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-accent/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-slate-600 group-hover:text-accent transition-colors"
                  />
                </div>
                <h3 className="text-slate-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Analytics (Visitors) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Page Analytics</h2>
              <select className="bg-slate-800 text-slate-300 text-sm border-none rounded-lg px-3 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="space-y-6">
              {/* Visitor Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Total Visitors</p>
                  <p className="text-2xl font-bold text-white">12,543</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    +15.3%
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Avg. Time</p>
                  <p className="text-2xl font-bold text-white">4m 32s</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    +2.1%
                  </p>
                </div>
              </div>

              {/* Simple Bar Chart Visualization using CSS */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-4">
                  Visitors by Country
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      country: "United States",
                      percent: 45,
                      color: "bg-blue-500",
                    },
                    {
                      country: "United Kingdom",
                      percent: 20,
                      color: "bg-purple-500",
                    },
                    {
                      country: "South Africa",
                      percent: 15,
                      color: "bg-orange-500",
                    },
                    { country: "Malawi", percent: 12, color: "bg-green-500" },
                    { country: "Others", percent: 8, color: "bg-slate-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-24">
                        {item.country}
                      </span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>

            <div className="space-y-3">
              <Link
                to="/admin/projects/new"
                className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 transition-colors text-accent group"
              >
                <Plus size={20} />
                <span className="font-medium">Add New Project</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/projects"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <Eye size={20} />
                <span className="font-medium">View Projects</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/messages"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <Mail size={20} />
                <span className="font-medium">Check Messages</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
