import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";
import projectRoutes from "./routes/projects.js";
import contactSubmissionRoutes from "./routes/contactSubmissions.js";
import testimonialRoutes from "./routes/testimonials.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
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
      contactSubmissions: '/api/contact-submissions',
      testimonials: '/api/testimonials'
    }
  });
});

app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact-submissions', contactSubmissionRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`🔐 Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`📁 Projects API: http://localhost:${PORT}/api/projects`);
  console.log(`📨 Submissions API: http://localhost:${PORT}/api/contact-submissions`);
  console.log(`⭐ Testimonials API: http://localhost:${PORT}/api/testimonials`);
});
