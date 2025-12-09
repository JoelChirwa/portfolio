import express from "express";
import Consultation from "../models/Consultation.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/consultations
// @desc    Submit consultation request
// @access  Public
router.post("/", async (req, res) => {
  try {
    const consultationData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
    };
    
    const consultation = new Consultation(consultationData);
    await consultation.save();
    
    // TODO: Send confirmation email to client
    // TODO: Send notification email to admin
    
    res.status(201).json({
      success: true,
      message: "Consultation request received! We'll contact you within 24 hours.",
      consultation: {
        id: consultation._id,
        name: consultation.name,
        projectType: consultation.projectType,
      },
    });
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit request",
    });
  }
});

// @route   GET /api/consultations
// @desc    Get all consultations
// @access  Private (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    
    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Consultation.countDocuments(query);
    
    res.json({
      success: true,
      consultations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/consultations/:id
// @desc    Get single consultation
// @access  Private (Admin)
router.get("/:id", protect, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }
    
    res.json({ success: true, consultation });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/consultations/:id
// @desc    Update consultation status/notes
// @access  Private (Admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }
    
    res.json({
      success: true,
      message: "Consultation updated",
      consultation,
    });
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   DELETE /api/consultations/:id
// @desc    Delete consultation
// @access  Private (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }
    
    res.json({
      success: true,
      message: "Consultation deleted",
    });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/consultations/stats/overview
// @desc    Get consultation statistics
// @access  Private (Admin)
router.get("/stats/overview", protect, async (req, res) => {
  try {
    const total = await Consultation.countDocuments();
    const newRequests = await Consultation.countDocuments({ status: "new" });
    const contacted = await Consultation.countDocuments({ status: "contacted" });
    const scheduled = await Consultation.countDocuments({ status: "scheduled" });
    const completed = await Consultation.countDocuments({ status: "completed" });
    
    // Project types breakdown
    const byProjectType = await Consultation.aggregate([
      { $group: { _id: "$projectType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    // Budget breakdown
    const byBudget = await Consultation.aggregate([
      { $group: { _id: "$budget", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          new: newRequests,
          contacted,
          scheduled,
          completed,
        },
        byProjectType,
        byBudget,
      },
    });
  } catch (error) {
    console.error("Error fetching consultation stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
