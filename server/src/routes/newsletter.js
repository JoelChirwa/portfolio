import express from "express";
import Subscriber from "../models/Subscriber.js";
import { protect } from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post("/subscribe", async (req, res) => {
  try {
    const { email, name, source = "homepage" } = req.body;
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    
    if (existing) {
      if (existing.status === "active") {
        return res.status(400).json({
          success: false,
          message: "This email is already subscribed!",
        });
      }
      
      // Reactivate if previously unsubscribed
      if (existing.status === "unsubscribed") {
        existing.status = "active";
        existing.subscribedDate = new Date();
        existing.unsubscribedDate = null;
        await existing.save();
        
        return res.json({
          success: true,
          message: "Welcome back! You've been resubscribed.",
        });
      }
    }
    
    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    const subscriber = new Subscriber({
      email,
      name,
      source,
      verificationToken,
      ipAddress: req.ip || req.connection.remoteAddress,
    });
    
    await subscriber.save();
    
    // TODO: Send welcome email with verification link
    
    res.status(201).json({
      success: true,
      message: "Successfully subscribed! Check your email to confirm.",
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to subscribe",
    });
  }
});

// @route   GET /api/newsletter/verify/:token
// @desc    Verify email subscription
// @access  Public
router.get("/verify/:token", async (req, res) => {
  try {
    const subscriber = await Subscriber.findOne({
      verificationToken: req.params.token,
    });
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification token",
      });
    }
    
    subscriber.isVerified = true;
    subscriber.verificationToken = undefined;
    await subscriber.save();
    
    res.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our list",
      });
    }
    
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedDate = new Date();
    await subscriber.save();
    
    res.json({
      success: true,
      message: "You've been unsubscribed. Sorry to see you go!",
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all subscribers
// @access  Private (Admin)
router.get("/subscribers", protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = status ? { status } : {};
    
    const subscribers = await Subscriber.find(query)
      .select("-verificationToken")
      .sort({ subscribedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Subscriber.countDocuments(query);
    
    res.json({
      success: true,
      subscribers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/newsletter/subscribers/:id
// @desc    Delete subscriber
// @access  Private (Admin)
router.delete("/subscribers/:id", protect, async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }
    
    res.json({
      success: true,
      message: "Subscriber deleted",
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics
// @access  Private (Admin)
router.get("/stats", protect, async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ status: "active" });
    const unsubscribed = await Subscriber.countDocuments({ status: "unsubscribed" });
    const verified = await Subscriber.countDocuments({ isVerified: true });
    
    // Growth over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubs = await Subscriber.countDocuments({
      subscribedDate: { $gte: thirtyDaysAgo },
    });
    
    // By source
    const bySource = await Subscriber.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.json({
      success: true,
      stats: {
        total,
        active,
        unsubscribed,
        verified,
        recentSubs,
        bySource,
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/newsletter/export
// @desc    Export subscribers (CSV)
// @access  Private (Admin)
router.post("/export", protect, async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ status: "active" })
      .select("email name subscribedDate source")
      .sort({ subscribedDate: -1 });
    
    // Simple CSV format
    let csv = "Email,Name,Subscribed Date,Source\n";
    subscribers.forEach(sub => {
      csv += `${sub.email},${sub.name || ""},${sub.subscribedDate},${sub.source}\n`;
    });
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting subscribers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
