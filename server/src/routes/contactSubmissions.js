import express from "express";
import ContactSubmission from "../models/ContactSubmission.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/contact-submissions
// @desc    Get all contact submissions
// @access  Private (Admin only)
router.get("/", protect, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    
    if (status && status !== "all") {
      query.status = status;
    }

    const submissions = await ContactSubmission.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching submissions",
    });
  }
});

// @route   GET /api/contact-submissions/:id
// @desc    Get single submission
// @access  Private (Admin only)
router.get("/:id", protect, async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Mark as read
    if (submission.status === "new") {
      submission.status = "read";
      await submission.save();
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("Get submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching submission",
    });
  }
});

// @route   PUT /api/contact-submissions/:id
// @desc    Update submission status/notes
// @access  Private (Admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    const { status, notes } = req.body;

    let submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (status) submission.status = status;
    if (notes !== undefined) submission.notes = notes;

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission updated successfully",
      submission,
    });
  } catch (error) {
    console.error("Update submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating submission",
    });
  }
});

// @route   DELETE /api/contact-submissions/:id
// @desc    Delete submission
// @access  Private (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    await ContactSubmission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Delete submission error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting submission",
    });
  }
});

// @route   GET /api/contact-submissions/stats/overview
// @desc    Get submission statistics
// @access  Private (Admin only)
router.get("/stats/overview", protect, async (req, res) => {
  try {
    const total = await ContactSubmission.countDocuments();
    const newCount = await ContactSubmission.countDocuments({ status: "new" });
    const readCount = await ContactSubmission.countDocuments({ status: "read" });
    const repliedCount = await ContactSubmission.countDocuments({ status: "replied" });

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching statistics",
    });
  }
});

export default router;
