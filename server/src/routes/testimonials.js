import express from "express";
import Testimonial from "../models/Testimonial.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get all active testimonials (public)
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/testimonials/all
// @desc    Get ALL testimonials (admin)
router.get("/all", protect, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/testimonials
// @desc    Create a testimonial (admin)
router.post("/", protect, async (req, res) => {
  try {
    const { name, role, text, rating, image } = req.body;

    const testimonial = new Testimonial({
      name,
      role,
      text,
      rating,
      image,
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/testimonials/:id
// @desc    Update a testimonial (admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, role, text, rating, image, isActive } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      testimonial.name = name || testimonial.name;
      testimonial.role = role || testimonial.role;
      testimonial.text = text || testimonial.text;
      testimonial.rating = rating || testimonial.rating;
      testimonial.image = image || testimonial.image;
      if (isActive !== undefined) testimonial.isActive = isActive;

      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: "Testimonial not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: "Testimonial removed" });
    } else {
      res.status(404).json({ message: "Testimonial not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
