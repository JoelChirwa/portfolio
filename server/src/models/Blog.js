import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "Academic Services",
      "Grant Writing",
      "Microsoft Word",
      "Data Entry",
      "Freelancing Tips",
      "Technology",
      "Business",
      "Other",
      "Advocacy",
    ],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: String,
    default: "Joel Chirwa",
  },
  readTime: {
    type: Number, // in minutes
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedDate: {
    type: Date,
  },
  metaDescription: {
    type: String,
    maxlength: 160,
  },
  metaKeywords: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Auto-generate slug from title
blogSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  // Calculate read time based on content (avg 200 words/min)
  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  // Set published date when publishing
  if (this.isModified("isPublished") && this.isPublished && !this.publishedDate) {
    this.publishedDate = new Date();
  }
  
  next();
});

// Indexes for performance
// Note: slug index is automatically created due to unique: true in schema
blogSchema.index({ isPublished: 1, publishedDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
