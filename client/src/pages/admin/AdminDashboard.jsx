import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  Globe,
  Activity,
  Mail,
  Newspaper,
  FileText,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { getAnalyticsStats } from "../../utils/analytics";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, featured: 0 },
    blogs: { total: 0, published: 0 },
    consultations: { total: 0, pending: 0 },
    newsletter: { total: 0 },
  });

  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    visitorGrowth: 0,
    avgTime: "0m 0s",
    timeGrowth: 0,
    countries: [],
    topPages: [],
    deviceStats: [],
    browserStats: [],
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState(7); // Days

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchDashboardData();
  }, [analyticsPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // Fetch projects with individual error handling
      try {
        const projectsRes = await fetch(`${API_URL}/api/projects`);
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setStats((prev) => ({
            ...prev,
            projects: {
              total: projectsData.count || 0,
              featured:
                projectsData.projects?.filter((p) => p.featured).length || 0,
            },
          }));
        } else {
          console.error("Failed to fetch projects:", projectsRes.status);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }

      // Fetch blogs stats
      try {
        const blogsRes = await fetch(`${API_URL}/api/blogs`);
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          setStats((prev) => ({
            ...prev,
            blogs: {
              total: blogsData.blogs?.length || 0,
              published:
                blogsData.blogs?.filter((b) => b.isPublished).length || 0,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }

      // Fetch consultations stats
      try {
        const consultationsRes = await fetch(`${API_URL}/api/consultations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (consultationsRes.ok) {
          const consultationsData = await consultationsRes.json();
          setStats((prev) => ({
            ...prev,
            consultations: {
              total: consultationsData.consultations?.length || 0,
              pending:
                consultationsData.consultations?.filter(
                  (c) => c.status === "pending"
                ).length || 0,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }

      // Fetch newsletter stats
      try {
        const newsletterRes = await fetch(
          `${API_URL}/api/newsletter/subscribers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (newsletterRes.ok) {
          const newsletterData = await newsletterRes.json();
          setStats((prev) => ({
            ...prev,
            newsletter: {
              total: newsletterData.count || 0,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching newsletter:", error);
      }

      // Fetch analytics data
      try {
        const analyticsData = await getAnalyticsStats(token, analyticsPeriod);
        if (analyticsData && analyticsData.success) {
          setAnalytics({
            totalVisitors: analyticsData.stats.totalVisitors || 0,
            visitorGrowth: analyticsData.stats.visitorGrowth || 0,
            avgTime: analyticsData.stats.avgTime || "0m 0s",
            timeGrowth: analyticsData.stats.timeGrowth || 0,
            countries: analyticsData.stats.countries || [],
            topPages: analyticsData.stats.topPages || [],
            deviceStats: analyticsData.stats.deviceStats || [],
            browserStats: analyticsData.stats.browserStats || [],
          });
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }

      // Fetch chart data
      try {
        const chartRes = await fetch(
          `${API_URL}/api/analytics/chart-data?period=${analyticsPeriod}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (chartRes.ok) {
          const chartJson = await chartRes.json();
          if (chartJson.success) {
            setChartData(chartJson.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Visitors",
      value: analytics.totalVisitors.toLocaleString(),
      icon: <Users size={24} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      growth: analytics.visitorGrowth,
      link: "/admin/engagement",
    },
    {
      title: "Total Projects",
      value: stats.projects.total,
      icon: <FolderOpen size={24} />,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      link: "/admin/projects",
    },
    {
      title: "Published Blogs",
      value: stats.blogs.published,
      icon: <Newspaper size={24} />,
      color: "text-green-400",
      bg: "bg-green-400/10",
      link: "/admin/blogs",
    },
    {
      title: "Consultations",
      value: stats.consultations.total,
      icon: <FileText size={24} />,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      link: "/admin/consultations",
    },
  ];

  // Calculate max value for chart scaling
  const maxVisitors = Math.max(...chartData.map((d) => d.visitors), 1);

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400">
            Comprehensive overview of your portfolio performance
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end">
          <select
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-accent/50 transition-colors"
            value={analyticsPeriod}
            onChange={(e) => setAnalyticsPeriod(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>This Year</option>
          </select>
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
                {stat.growth !== undefined && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      stat.growth >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    <TrendingUp size={12} />
                    {stat.growth >= 0 ? "+" : ""}
                    {stat.growth}%
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Visitor Trends</h2>
              <Activity size={20} className="text-accent" />
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-3">
                {chartData.map((item, index) => {
                  const date = new Date(item.date);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  const percentage = (item.visitors / maxVisitors) * 100;

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{formattedDate}</span>
                        <span className="text-accent font-medium">
                          {item.visitors} visitors
                        </span>
                      </div>
                      <div className="h-8 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-accent/50 to-accent rounded-lg transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No visitor data yet</p>
              </div>
            )}
          </motion.div>

          {/* Top Pages & Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Content Performance
              </h2>
              <Eye size={20} className="text-accent" />
            </div>

            {analytics.topPages.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPages.slice(0, 7).map((page, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {page.page}
                        </p>
                        <p className="text-xs text-slate-500">Page views</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-accent">
                          {page.views}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No page data yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Geographic & Time Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Geographic Distribution
              </h2>
              <Globe size={20} className="text-accent" />
            </div>

            <div className="space-y-6">
              {/* Visitor Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Avg. Time</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.avgTime}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      analytics.timeGrowth >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <Clock size={12} />
                    {analytics.timeGrowth >= 0 ? "+" : ""}
                    {analytics.timeGrowth}%
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Countries</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.countries.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Unique</p>
                </div>
              </div>

              {/* Countries Bar Chart */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-4">
                  Visitors by Country
                </h3>
                {analytics.countries.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.countries.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-24 truncate">
                          {item.country}
                        </span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              i === 0
                                ? "bg-green-500"
                                : i === 1
                                ? "bg-blue-500"
                                : i === 2
                                ? "bg-orange-500"
                                : i === 3
                                ? "bg-purple-500"
                                : "bg-slate-500"
                            }`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">
                          {item.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No visitor data yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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
                to="/admin/blogs/new"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <Newspaper size={20} />
                <span className="font-medium">Write New Blog</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/consultations"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <FileText size={20} />
                <span className="font-medium">View Consultations</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/engagement"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <BarChart3 size={20} />
                <span className="font-medium">View Full Analytics</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/admin/campaigns"
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white group"
              >
                <Mail size={20} />
                <span className="font-medium">Email Campaigns</span>
                <ArrowRight
                  size={18}
                  className="ml-auto group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Conversion Funnel Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Conversion Funnel</h2>
            <TrendingUp size={20} className="text-accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Stage 1: Visits */}
            <div className="relative">
              <div className="bg-blue-500/10 border-2 border-blue-500 rounded-lg p-6 text-center">
                <p className="text-sm text-blue-400 mb-2">Stage 1</p>
                <p className="text-3xl font-bold text-white">
                  {analytics.totalVisitors}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total Visits</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <ArrowRight className="text-slate-600" size={24} />
              </div>
            </div>

            {/* Stage 2: Engagement */}
            <div className="relative">
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-lg p-6 text-center">
                <p className="text-sm text-purple-400 mb-2">Stage 2</p>
                <p className="text-3xl font-bold text-white">
                  {analytics.topPages.length > 0
                    ? analytics.topPages.reduce((sum, p) => sum + p.views, 0)
                    : 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">Page Views</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <ArrowRight className="text-slate-600" size={24} />
              </div>
            </div>

            {/* Stage 3: Interest */}
            <div className="relative">
              <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-6 text-center">
                <p className="text-sm text-green-400 mb-2">Stage 3</p>
                <p className="text-3xl font-bold text-white">
                  {stats.consultations.total}
                </p>
                <p className="text-xs text-slate-400 mt-1">Consultations</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                <ArrowRight className="text-slate-600" size={24} />
              </div>
            </div>

            {/* Stage 4: Subscribers */}
            <div>
              <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 text-center">
                <p className="text-sm text-accent mb-2">Stage 4</p>
                <p className="text-3xl font-bold text-white">
                  {stats.newsletter.total}
                </p>
                <p className="text-xs text-slate-400 mt-1">Subscribers</p>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-slate-400">Overall Conversion Rate</p>
              <p className="text-2xl font-bold text-accent">
                {analytics.totalVisitors > 0
                  ? (
                      ((stats.consultations.total + stats.newsletter.total) /
                        analytics.totalVisitors) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
