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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// Only start server if not running on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;
