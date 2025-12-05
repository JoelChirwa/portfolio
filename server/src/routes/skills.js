import express from "express";
import Skill from "../models/Skill.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching skills",
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Get skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching skill",
    });
  }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private (Admin only)
router.post("/", protect, async (req, res) => {
  try {
    const { name, level, category, order } = req.body;

    if (!name || level === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and level",
      });
    }

    const skill = await Skill.create({
      name,
      level,
      category: category || "General",
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating skill",
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private (Admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    skill = await Skill.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating skill",
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting skill",
    });
  }
});

export default router;
