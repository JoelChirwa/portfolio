import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  projectType: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "Microsoft Word Services",
      "Grant Writing",
      "Academic Services",
      "Data Entry",
      "PDF/Image Conversion",
      "Other",
    ],
  },
  budget: {
    type: String,
    enum: [
      "Under $100",
      "$100 - $500",
      "$500 - $1000",
      "$1000 - $3000",
      "$3000+",
      "Not sure yet",
    ],
  },
  timeline: {
    type: String,
    required: true,
    enum: [
      "Urgent (1-3 days)",
      "Soon (1 week)",
      "Flexible (2-4 weeks)",
      "Planning (1+ month)",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
  },
  preferredTime: {
    type: String,
  },
  hearAboutUs: {
    type: String,
    enum: [
      "Google Search",
      "Social Media",
      "Referral",
      "Previous Client",
      "Other",
    ],
  },
  status: {
    type: String,
    enum: ["new", "contacted", "scheduled", "completed", "cancelled"],
    default: "new",
  },
  notes: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ status: 1 });

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
