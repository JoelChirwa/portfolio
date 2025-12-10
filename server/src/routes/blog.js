import express from "express";
import Blog from "../models/Blog.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blogs (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 10, published } = req.query;
    
    const query = {};
    
    // Only filter by published if explicitly requested
    if (published === "true") {
      query.isPublished = true;
    }
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    
    const blogs = await Blog.find(query)
      .select("-content") // Exclude full content in list
      .sort({ publishedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/blogs/admin/all
// @desc    Get all blogs (published & drafts)
// @access  Private (Admin)
router.get("/admin/all", protect, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .select("-content")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, blogs, count: blogs.length });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/blogs/admin/post/:id
// @desc    Get single blog by ID (for editing)
// @access  Private (Admin)
router.get("/admin/post/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/blogs/stats/overview
// @desc    Get blog statistics
// @access  Private (Admin)
router.get("/stats/overview", protect, async (req, res) => {
  try {
    const total = await Blog.countDocuments();
    const published = await Blog.countDocuments({ isPublished: true });
    const drafts = await Blog.countDocuments({ isPublished: false });
    
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    
    const topPosts = await Blog.find({ isPublished: true })
      .select("title slug views")
      .sort({ views: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: {
        total,
        published,
        drafts,
        totalViews: totalViews[0]?.total || 0,
        topPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/blogs/slug/:slug
// @desc    Get single blog by slug
// @access  Public
router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug (alternative route)
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    // Check if it's a valid MongoDB ID first (for other routes)
    if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ 
        success: false, 
        message: "Use /slug/ endpoint for slug-based queries" 
      });
    }
    
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/blogs/:id/view
// @desc    Increment blog view count
// @access  Public
router.post("/:id/view", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    blog.views += 1;
    await blog.save();
    
    res.json({ success: true, views: blog.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/blogs
// @desc    Create new blog
// @access  Private (Admin)
router.post("/", protect, async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Blog created successfully",
      blog 
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Private (Admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Blog updated successfully",
      blog 
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
// @access  Private (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Blog deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
