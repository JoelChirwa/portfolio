import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private (Admin only)
const uploadHandler = (req, res) => {
  try {
    console.log("Upload request received");
    console.log("File:", req.file);
    
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File uploaded successfully:", req.file.path);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path, // Cloudinary URL
      imageUrl: req.file.path, // For backward compatibility
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
      error: error.message,
    });
  }
};

router.post("/", protect, upload.single("image"), uploadHandler);
router.post("/image", protect, upload.single("image"), uploadHandler);

export default router;
