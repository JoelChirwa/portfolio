import express from "express";
import nodemailer from "nodemailer";
import ContactSubmission from "../models/ContactSubmission.js";

const router = express.Router();

// Email configuration
const createTransporter = () => {
  // For development, you can use a service like Gmail, Mailtrap, or SendGrid
  // For production, use a proper email service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });
};

// POST /api/contact - Send contact form email
router.post("/", async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Save to database
    const contactSubmission = await ContactSubmission.create({
      name,
      email,
      service: service || "Not specified",
      message,
    });

    // For development, just log the contact form data
    // You can skip email sending if credentials are not set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("📧 Contact Form Submission:");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Service:", service || "Not specified");
      console.log("Message:", message);
      
      return res.status(200).json({
        success: true,
        message: "Message received! (Email not configured for development)",
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email to you (website owner)
    const mailOptionsToOwner = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #38bdf8;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service Interest:</strong> ${service || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
    };

    // Send email to owner
    await transporter.sendMail(mailOptionsToOwner);

    // Optional: Send auto-reply to the person who contacted you
    const mailOptionsToSender = {
      from: `"Joel Chirwa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #38bdf8;">Thank You for Reaching Out!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your message. I have received your inquiry and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to check out my portfolio and recent work.</p>
          <p>Best regards,<br/>Joel Chirwa</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptionsToSender);

    res.status(200).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
});

export default router;
