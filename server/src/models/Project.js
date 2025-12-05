import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Academic Services",
        "Grant Writing",
        "Data Entry",
        "PDF/Image Conversion",
        "Microsoft Word Services",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    date: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    githubUrl: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
