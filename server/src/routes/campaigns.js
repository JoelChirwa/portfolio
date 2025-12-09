import express from "express";
import Campaign from "../models/Campaign.js";
import Subscriber from "../models/Subscriber.js";
import { protect } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

// --- Tracking Images (Tiny 1x1 GIF) ---
const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

// --- Email Transporter Setup ---
// NOTE: You must configure these in your .env file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// @route   POST /api/campaigns
// @desc    Create a draft campaign
// @access  Private (Admin)
router.post("/", protect, async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    const campaign = new Campaign({ title, subject, content });
    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/campaigns
// @desc    Get all campaigns
// @access  Private (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update campaign
// @access  Private (Admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign
// @access  Private (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/campaigns/:id/send
// @desc    Send campaign to active subscribers
// @access  Private (Admin)
router.post("/:id/send", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

    if (campaign.status === "sent") {
      return res.status(400).json({ success: false, message: "Campaign already sent" });
    }

    // 1. Get Active Subscribers
    const subscribers = await Subscriber.find({ status: "active" });
    if (subscribers.length === 0) {
      return res.status(400).json({ success: false, message: "No active subscribers found" });
    }

    campaign.status = "sending";
    await campaign.save();

    const API_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Should ideally be your production Service URL if different

    // 2. Loop and Send (In production, use a queue like BullMQ)
    let sentCount = 0;
    
    // Simple basic template wrapper
    const wrapContent = (content, subId, campId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        ${content}
        <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888; text-align: center;">
          <p>You received this email because you subscribed to Joel Chirwa's Portfolio.</p>
          <a href="${API_URL}/api/newsletter/unsubscribe?email=REPLACE_EMAIL" style="color: #666;">Unsubscribe</a>
        </div>
        <img src="${API_URL}/api/campaigns/track/open/${campId}/${subId}" width="1" height="1" style="display:none" />
      </div>
    `;

    // Mock sending loop (Nodejs loop)
    // In a real app, do this asynchronously or in background
    for (const sub of subscribers) {
      try {
        const trackingHtml = wrapContent(campaign.content, sub._id, campaign._id).replace("REPLACE_EMAIL", sub.email);

        await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || 'Joel Chirwa'}" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: campaign.subject,
          html: trackingHtml,
        });
        sentCount++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err);
      }
    }

    campaign.status = "sent";
    campaign.sentDate = new Date();
    campaign.recipientCount = sentCount;
    await campaign.save();

    res.json({ success: true, message: `Sent to ${sentCount} subscribers` });
  } catch (error) {
    console.error("Send error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/campaigns/track/open/:cid/:sid
// @desc    Track email open (Invisible Pixel)
// @access  Public
router.get("/track/open/:cid/:sid", async (req, res) => {
  try {
    const { cid, sid } = req.params;
    
    const campaign = await Campaign.findById(cid);
    if (campaign) {
      // Check if user already opened
      const alreadyOpened = campaign.openedBy.includes(sid);
      
      const update = {
        $inc: { "stats.opens": 1 }
      };
      
      if (!alreadyOpened) {
        update.$inc.uniqueOpens = 1;
        update.$push = { openedBy: sid };
      }
      
      // We use findOneAndUpdate to ensure atomic operations
       await Campaign.findByIdAndUpdate(cid, update);
    }
  } catch (error) {
    console.error("Tracking error:", error);
  } finally {
    // Always return the image so distinct email clients don't show broken image icon
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": PIXEL_GIF.length,
    });
    res.end(PIXEL_GIF);
  }
});

// @route   GET /api/campaigns/track/click
// @desc    Track link click and redirect
// @access  Public
router.get("/track/click", async (req, res) => {
  try {
    const { url, cid, sid } = req.query;
    
    if (!url) return res.status(400).send("Invalid URL");

    if (cid && sid) {
       const campaign = await Campaign.findById(cid);
       if (campaign) {
         const alreadyClicked = campaign.clickedBy.includes(sid);
         const update = { $inc: { "stats.clicks": 1 } };
         if (!alreadyClicked) {
           update["stats.uniqueClicks"] = 1; // Mongoose $inc syntax
           update.$push = { clickedBy: sid };
         }
         await Campaign.findByIdAndUpdate(cid, update);
       }
    }
    
    res.redirect(url);
  } catch (error) {
    console.error("Click tracking error:", error);
    res.redirect(req.query.url || "/");
  }
});

export default router;
