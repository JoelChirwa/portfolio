import express from "express";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { generateToken, protect } from "../middleware/auth.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

// @route   POST /api/admin/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Email could not be sent" });
    }

    // Get Reset Token
    const resetToken = admin.getResetPasswordToken();

    await admin.save({ validateBeforeSave: false });

    // Create Reset Url
    // Frontend URL
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #38bdf8;">Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:</p>
          <p style="text-align: center; margin: 30px 0;">
             <a href="${resetUrl}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </p>
          <p>If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: admin.email,
        subject: "Password Reset Token",
        html: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.error(err);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;

      await admin.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/admin/resetpassword/:resetToken
// @desc    Reset Password
// @access  Public
router.put("/resetpassword/:resetToken", async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid Token" });
    }

    // Set new password
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.status(200).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   POST /api/admin/register
// @desc    Register new admin (for initial setup only - protect in production!)
// @access  Public (should be protected or removed in production)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this username or email already exists",
      });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.username = req.body.username || admin.username;
      admin.email = req.body.email || admin.email;
      admin.avatar = req.body.avatar || admin.avatar;
      
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        admin: {
          id: updatedAdmin._id,
          username: updatedAdmin.username,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
          avatar: updatedAdmin.avatar,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST /api/admin/logout
// @desc    Logout admin
// @access  Private
router.post("/logout", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export default router;
