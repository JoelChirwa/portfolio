import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./src/models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio");
    console.log("✅ MongoDB Connected\n");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Username:", existingAdmin.username);
      console.log("Email:", existingAdmin.email);
      console.log("\nTo reset the password, delete the admin user first or use a different username.\n");
      process.exit(0);
    }

    // Create admin user
    console.log("👤 Creating admin user...");
    
    const adminData = {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    };

    const admin = await Admin.create(adminData);

    console.log("\n✅ Admin user created successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Username: ${admin.username}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🔐 You can now login at: http://localhost:5173/admin/login\n");
    console.log("⚠️  IMPORTANT: Change this password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
