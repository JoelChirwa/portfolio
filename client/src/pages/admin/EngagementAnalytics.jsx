import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Activity,
  Eye,
  Clock,
  Users,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import MiniLoader from "../../components/MiniLoader";

const EngagementAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [data, setData] = useState({
    whatsappClicks: 0,
    faqClicks: [],
    totalEngagement: 0,
    topPages: [],
    deviceStats: [],
    browserStats: [],
    totalVisitors: 0,
    avgTime: "0m 0s",
    visitorGrowth: 0,
  });
  const [chartData, setChartData] = useState([]);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchEngagementData();
  }, [period]);

  const fetchEngagementData = async () => {
    setLoading(true);
    try {
      // Fetch all analytics data
      const response = await fetch(
        `${API_URL}/api/analytics/stats?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        // Filter WhatsApp and FAQ clicks from topPages
        const whatsappPages = result.stats.topPages.filter(
          (p) => p.page === "WhatsApp Button"
        );
        const faqPages = result.stats.topPages.filter((p) =>
          p.page.startsWith("FAQ:")
        );

        const whatsappCount = whatsappPages.reduce(
          (sum, p) => sum + p.views,
          0
        );
        const totalFaqClicks = faqPages.reduce((sum, p) => sum + p.views, 0);

        setData({
          whatsappClicks: whatsappCount,
          faqClicks: faqPages.sort((a, b) => b.views - a.views),
          totalEngagement: whatsappCount + totalFaqClicks,
          topPages: result.stats.topPages.filter(
            (p) => !p.page.startsWith("FAQ:") && p.page !== "WhatsApp Button"
          ),
          deviceStats: result.stats.deviceStats || [],
          browserStats: result.stats.browserStats || [],
          totalVisitors: result.stats.totalVisitors || 0,
          avgTime: result.stats.avgTime || "0m 0s",
          visitorGrowth: result.stats.visitorGrowth || 0,
        });
      }

      // Fetch chart data
      const chartRes = await fetch(
        `${API_URL}/api/analytics/chart-data?period=${period}`,
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
      console.error("Error fetching engagement data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone size={20} />;
      case "tablet":
        return <Tablet size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  const maxVisitors = Math.max(...chartData.map((d) => d.visitors), 1);
  const totalDeviceCount = data.deviceStats.reduce(
    (sum, d) => sum + d.count,
    0
  );
  const totalBrowserCount = data.browserStats.reduce(
    (sum, b) => sum + b.count,
    0
  );

  if (loading) {
    return (
      <AdminLayout>
        <MiniLoader text="Loading analytics data" size="lg" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Engagement Analytics
            </h1>
            <p className="text-slate-400">
              Comprehensive analytics and user behavior insights
            </p>
          </div>
          <select
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-accent/50 transition-colors"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>This Year</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users size={24} className="text-blue-500" />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">Total Visitors</h3>
            <p className="text-3xl font-bold text-white">
              {data.totalVisitors}
            </p>
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                data.visitorGrowth >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              <TrendingUp size={12} />
              {data.visitorGrowth >= 0 ? "+" : ""}
              {data.visitorGrowth}%
            </p>
          </motion.div>

          {/* WhatsApp Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <MessageCircle size={24} className="text-green-500" />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">WhatsApp Clicks</h3>
            <p className="text-3xl font-bold text-white">
              {data.whatsappClicks}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Direct conversation initiations
            </p>
          </motion.div>

          {/* FAQ Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <HelpCircle size={24} className="text-purple-500" />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">FAQ Interactions</h3>
            <p className="text-3xl font-bold text-white">
              {data.faqClicks.reduce((sum, f) => sum + f.views, 0)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Questions opened by visitors
            </p>
          </motion.div>

          {/* Total Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Activity size={24} className="text-accent" />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-1">Total Engagement</h3>
            <p className="text-3xl font-bold text-white">
              {data.totalEngagement}
            </p>
            <p className="text-xs text-slate-500 mt-2">Combined interactions</p>
          </motion.div>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart3 size={20} className="text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Daily Visitor Trend
              </h2>
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-3">
                {chartData.slice(-14).map((item, index) => {
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
                        <span className="text-blue-400 font-medium">
                          {item.visitors} visitors
                        </span>
                      </div>
                      <div className="h-8 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-linear-to-r from-blue-500/50 to-blue-500 rounded-lg transition-all duration-500"
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

          {/* Most Clicked FAQ Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <HelpCircle size={20} className="text-purple-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Most Clicked FAQs
              </h2>
            </div>

            {data.faqClicks.length > 0 ? (
              <div className="space-y-4">
                {data.faqClicks.slice(0, 7).map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-950 rounded-lg border border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">
                          {faq.page.replace("FAQ: ", "")}
                        </p>
                        <p className="text-sm text-slate-500">
                          Clicked {faq.views} time{faq.views !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {faq.views}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${
                            (faq.views /
                              Math.max(...data.faqClicks.map((f) => f.views))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">
                  No FAQ interactions yet. Visitors will start engaging soon!
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Device & Browser Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Monitor size={20} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Device Distribution
              </h2>
            </div>

            {data.deviceStats.length > 0 ? (
              <div className="space-y-4">
                {data.deviceStats.map((device, index) => {
                  const percentage =
                    totalDeviceCount > 0
                      ? ((device.count / totalDeviceCount) * 100).toFixed(1)
                      : 0;
                  return (
                    <div
                      key={index}
                      className="p-4 bg-slate-950 rounded-lg border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-green-400">
                            {getDeviceIcon(device.device)}
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">
                              {device.device}
                            </p>
                            <p className="text-xs text-slate-500">
                              {device.count} visits
                            </p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-green-400">
                          {percentage}%
                        </p>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Monitor size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No device data yet</p>
              </div>
            )}
          </motion.div>

          {/* Browser Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Globe size={20} className="text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Browser Distribution
              </h2>
            </div>

            {data.browserStats.length > 0 ? (
              <div className="space-y-4">
                {data.browserStats.map((browser, index) => {
                  const percentage =
                    totalBrowserCount > 0
                      ? ((browser.count / totalBrowserCount) * 100).toFixed(1)
                      : 0;
                  const colors = [
                    "text-orange-400 bg-orange-500",
                    "text-blue-400 bg-blue-500",
                    "text-purple-400 bg-purple-500",
                    "text-green-400 bg-green-500",
                    "text-pink-400 bg-pink-500",
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={index}
                      className="p-4 bg-slate-950 rounded-lg border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`text-lg ${color.split(" ")[0]}`}>
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {browser.browser}
                            </p>
                            <p className="text-xs text-slate-500">
                              {browser.count} visits
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            color.split(" ")[0]
                          }`}
                        >
                          {percentage}%
                        </p>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color.split(" ")[1]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe size={48} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">No browser data yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Top Pages Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <Eye size={20} className="text-accent" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Top Pages Performance
            </h2>
          </div>

          {data.topPages.length > 0 ? (
            <div className="space-y-3">
              {data.topPages.map((page, index) => {
                const maxViews = Math.max(...data.topPages.map((p) => p.views));
                const percentage = ((page.views / maxViews) * 100).toFixed(0);

                return (
                  <div
                    key={index}
                    className="p-4 bg-slate-950 rounded-lg border border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{page.page}</p>
                      <span className="text-accent font-bold">
                        {page.views} views
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-accent/50 to-accent"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">No page data yet</p>
            </div>
          )}
        </motion.div>

        {/* Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-linear-to-br from-accent/10 to-purple-500/10 border border-accent/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            💡 Insights & Recommendations
          </h3>
          <ul className="space-y-3 text-slate-300">
            {data.totalVisitors > 100 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  Excellent! You have {data.totalVisitors} visitors. Your
                  portfolio is gaining good traction.
                </span>
              </li>
            )}
            {data.whatsappClicks > 10 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  Great! Your WhatsApp button is getting good engagement (
                  {data.whatsappClicks} clicks). Keep response times fast to
                  convert these leads.
                </span>
              </li>
            )}
            {data.whatsappClicks === 0 && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">⚠</span>
                <span>
                  No WhatsApp clicks yet. Make sure the button is visible and
                  your number is correct.
                </span>
              </li>
            )}
            {data.faqClicks.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  The most clicked FAQ question is "
                  {data.faqClicks[0].page.replace("FAQ: ", "")}". Consider
                  addressing this upfront in your hero section or services.
                </span>
              </li>
            )}
            {data.faqClicks.length === 0 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500">ℹ</span>
                <span>
                  No FAQ interactions yet. Promote the FAQ section or highlight
                  it more prominently on the homepage.
                </span>
              </li>
            )}
            {data.deviceStats.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-accent">📊</span>
                <span>
                  Most visitors use {data.deviceStats[0].device}. Ensure your
                  portfolio is optimized for this device type.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-accent">📈</span>
              <span>
                Total engagement: {data.totalEngagement} interactions. Continue
                monitoring this to track trends and improve user experience.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default EngagementAnalytics;
