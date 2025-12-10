import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";
import projectRoutes from "./routes/projects.js";
import testimonialRoutes from "./routes/testimonials.js";
import skillRoutes from "./routes/skills.js";
import uploadRoutes from "./routes/upload.js";
import analyticsRoutes from "./routes/analytics.js";
import blogRoutes from "./routes/blog.js";
import consultationRoutes from "./routes/consultations.js";
import newsletterRoutes from "./routes/newsletter.js";
import campaignRoutes from "./routes/campaigns.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB Connected");
    } else {
      console.log("⚠️  MongoDB URI not configured - running without database");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Joel Portfolio API is running',
    endpoints: {
      contact: '/api/contact',
      admin: '/api/admin',
      projects: '/api/projects',
      testimonials: '/api/testimonials',
      skills: '/api/skills',
      analytics: '/api/analytics',
      blogs: '/api/blogs',
      consultations: '/api/consultations',
      newsletter: '/api/newsletter'
    }
  });
});

// For Vercel deployment, routes are accessed via /api/* rewrite
// So we mount routes at both /api/* and /* to support both Vercel and local dev
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  // On Vercel, the /api/ prefix is already handled by the rewrite
  app.use('/contact', contactRoutes);
  app.use('/admin', adminRoutes);
  app.use('/projects', projectRoutes);
  app.use('/testimonials', testimonialRoutes);
  app.use('/skills', skillRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/analytics', analyticsRoutes);
  app.use('/blogs', blogRoutes);
  app.use('/consultations', consultationRoutes);
  app.use('/newsletter', newsletterRoutes);
  app.use('/campaigns', campaignRoutes);
} else {
  // For local development, keep /api prefix
  app.use('/api/contact', contactRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/consultations', consultationRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/campaigns', campaignRoutes);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Backend working on Vercel!" });
});

export default app;
