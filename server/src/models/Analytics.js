import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  // Page information
  page: {
    type: String,
    required: true,
    index: true,
  },
  path: {
    type: String,
    required: true,
  },
  
  // Visitor information
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
  },
  
  // Location data (from IP geolocation)
  country: {
    type: String,
    default: "Unknown",
  },
  city: {
    type: String,
  },
  
  // Referrer
  referrer: {
    type: String,
  },
  
  // Session tracking
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  
  // Time spent (in seconds) - will be updated when user leaves
  timeSpent: {
    type: Number,
    default: 0,
  },
  
  // Device info
  device: {
    type: String,
    enum: ["desktop", "mobile", "tablet", "unknown"],
    default: "unknown",
  },
  
  // Browser info
  browser: {
    type: String,
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ page: 1, timestamp: -1 });
analyticsSchema.index({ country: 1, timestamp: -1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
