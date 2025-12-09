import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "unsubscribed", "bounced"],
    default: "active",
  },
  subscribedDate: {
    type: Date,
    default: Date.now,
  },
  unsubscribedDate: {
    type: Date,
  },
  source: {
    type: String,
    enum: ["homepage", "blog", "footer", "popup", "consultation", "manual"],
    default: "homepage",
  },
  tags: [{
    type: String,
    trim: true,
  }],
  ipAddress: {
    type: String,
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
// Note: email index is automatically created due to unique: true in schema
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ subscribedDate: -1 });

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
