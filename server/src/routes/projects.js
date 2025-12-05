import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== "All") {
      query.category = category;
    }
    
    if (featured === "true") {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching projects",
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching project",
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      longDescription,
      image,
      tags,
      date,
      featured,
      githubUrl,
      liveUrl,
      clientName,
      isAnonymous,
    } = req.body;

    // Validation
    if (!title || !category || !description || !longDescription || !image || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const project = await Project.create({
      title,
      category,
      description,
      longDescription,
      image,
      tags: tags || [],
      date,
      featured: featured || false,
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      clientName: clientName || "",
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating project",
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating project",
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting project",
    });
  }
});

export default router;
