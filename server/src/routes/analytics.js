import express from "express";
import Analytics from "../models/Analytics.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  
  // Detect device
  let device = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "mobile";
  } else if (/tablet|ipad/i.test(ua)) {
    device = "tablet";
  }
  
  // Detect browser
  let browser = "Other";
  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome") && !ua.includes("edge")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";
  
  return { device, browser };
};

// Helper function to get country from IP
const getCountryFromIP = async (ip, req) => {
  // Check for Vercel geo headers first (available on Vercel deployments)
  const vercelCountry = req.headers['x-vercel-ip-country'];
  if (vercelCountry) {
    return vercelCountry;
  }
  
  // Detect local/private IPs
  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168") || ip.startsWith("10.") || ip.startsWith("::ffff:127.") || ip.startsWith("::ffff:192.168")) {
    return "Local";
  }
  
  // Use free IP geolocation API as fallback
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_name/`, {
      timeout: 3000
    });
    if (response.ok) {
      const country = await response.text();
      return country.trim() || "Unknown";
    }
  } catch (error) {
    console.error('IP geolocation failed:', error);
  }
  
  return "Unknown";
};

// @route   POST /api/analytics/track
// @desc    Track a page view
// @access  Public
router.post("/track", async (req, res) => {
  try {
    const { page, path, sessionId, referrer } = req.body;
    
    // Get IP address - check various headers for real IP (especially on Vercel)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || 
                      req.headers['x-real-ip'] || 
                      req.ip || 
                      req.connection.remoteAddress || 
                      "Unknown";
    
    // Parse user agent
    const userAgent = req.headers["user-agent"] || "";
    const { device, browser } = parseUserAgent(userAgent);
    
    // Get country with geolocation
    const country = await getCountryFromIP(ipAddress, req);
    
    // Create analytics entry
    const analyticsEntry = new Analytics({
      page,
      path,
      ipAddress,
      userAgent,
      country,
      sessionId,
      referrer,
      device,
      browser,
    });
    
    await analyticsEntry.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Page view tracked",
      id: analyticsEntry._id 
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to track analytics" 
    });
  }
});

// @route   PUT /api/analytics/track/:id/time
// @desc    Update time spent on page
// @access  Public
router.put("/track/:id/time", async (req, res) => {
  try {
    const { timeSpent } = req.body;
    
    const entry = await Analytics.findByIdAndUpdate(
      req.params.id,
      { timeSpent },
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        message: "Analytics entry not found" 
      });
    }
    
    res.json({ success: true, message: "Time updated" });
  } catch (error) {
    console.error("Time update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update time" 
    });
  }
});

// @route   GET /api/analytics/stats
// @desc    Get analytics statistics
// @access  Private (Admin only)
router.get("/stats", protect, async (req, res) => {
  try {
    const { period = "7" } = req.query; // Days to look back
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    // Total visitors in period (exclude local visits)
    const totalVisitors = await Analytics.countDocuments({
      timestamp: { $gte: startDate },
      country: { $ne: "Local" }
    });
    
    // Previous period for comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - (daysAgo * 2));
    const previousEndDate = startDate;
    
    const previousVisitors = await Analytics.countDocuments({
      timestamp: { $gte: previousStartDate, $lt: previousEndDate },
      country: { $ne: "Local" }
    });
    
    // Calculate growth percentage
    const visitorGrowth = previousVisitors > 0 
      ? (((totalVisitors - previousVisitors) / previousVisitors) * 100).toFixed(1)
      : 0;
    
    // Average time spent (in seconds)
    const timeStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, timeSpent: { $gt: 0 }, country: { $ne: "Local" } } },
      { $group: { _id: null, avgTime: { $avg: "$timeSpent" } } },
    ]);
    
    const avgTimeSeconds = timeStats.length > 0 ? Math.round(timeStats[0].avgTime) : 0;
    const avgTimeFormatted = `${Math.floor(avgTimeSeconds / 60)}m ${avgTimeSeconds % 60}s`;
    
    // Previous period average time
    const previousTimeStats = await Analytics.aggregate([
      { $match: { 
        timestamp: { $gte: previousStartDate, $lt: previousEndDate },
        timeSpent: { $gt: 0 },
        country: { $ne: "Local" }
      }},
      { $group: { _id: null, avgTime: { $avg: "$timeSpent" } } },
    ]);
    
    const previousAvgTimeSeconds = previousTimeStats.length > 0 
      ? Math.round(previousTimeStats[0].avgTime) 
      : 0;
    
    const timeGrowth = previousAvgTimeSeconds > 0
      ? (((avgTimeSeconds - previousAvgTimeSeconds) / previousAvgTimeSeconds) * 100).toFixed(1)
      : 0;
    
    // Visitors by country (exclude local)
    const countryStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: "Local" } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    const totalForPercentage = countryStats.reduce((sum, c) => sum + c.count, 0);
    const countriesWithPercent = countryStats.map(c => ({
      country: c._id || "Unknown",
      count: c.count,
      percent: totalForPercentage > 0 
        ? Math.round((c.count / totalForPercentage) * 100) 
        : 0,
    }));
    
    // Top pages (exclude local)
    const topPages = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: "Local" } } },
      { $group: { _id: "$page", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);
    
    // Device statistics (exclude local)
    const deviceStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: "Local" } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    // Browser statistics (exclude local)
    const browserStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: "Local" } } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.json({
      success: true,
      stats: {
        totalVisitors,
        visitorGrowth: parseFloat(visitorGrowth),
        avgTime: avgTimeFormatted,
        avgTimeSeconds,
        timeGrowth: parseFloat(timeGrowth),
        countries: countriesWithPercent,
        topPages: topPages.map(p => ({
          page: p._id,
          views: p.views,
        })),
        deviceStats: deviceStats.map(d => ({
          device: d._id || "Unknown",
          count: d.count,
        })),
        browserStats: browserStats.map(b => ({
          browser: b._id || "Unknown",
          count: b.count,
        })),
      },
    });
  } catch (error) {
    console.error("Stats retrieval error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve stats" 
    });
  }
});

// @route   GET /api/analytics/chart-data
// @desc    Get daily visitor data for charts
// @access  Private (Admin only)
router.get("/chart-data", protect, async (req, res) => {
  try {
    const { period = "7" } = req.query;
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);
    
    const dailyStats = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate }, country: { $ne: "Local" } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    res.json({
      success: true,
      data: dailyStats.map(d => ({
        date: d._id,
        visitors: d.visitors,
      })),
    });
  } catch (error) {
    console.error("Chart data error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve chart data" 
    });
  }
});

export default router;
