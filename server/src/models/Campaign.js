import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true, // Internal name
  },
  content: {
    type: String,
    required: true, // HTML content
  },
  status: {
    type: String,
    enum: ["draft", "sending", "sent", "failed"],
    default: "draft",
  },
  sentDate: {
    type: Date,
  },
  recipientCount: {
    type: Number,
    default: 0,
  },
  stats: {
    opens: {
      type: Number,
      default: 0,
    },
    uniqueOpens: {
      type: Number, // Count distinct subscribers who opened
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
  },
  // To track which specific users opened (for avoiding double counting unique opens)
  openedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber",
  }],
  clickedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber",
  }],
}, {
  timestamps: true,
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
