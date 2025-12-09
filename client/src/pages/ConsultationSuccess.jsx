import React from "react";
import { motion } from "framer-motion";
import { Check, Calendar, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import NewsletterForm from "../components/NewsletterForm";

const ConsultationSuccess = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="text-green-500" size={40} />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Request <span className="gradient-text">Received!</span>
          </h1>

          <p className="text-slate-300 text-lg mb-6">
            Thank you for your interest! I've received your consultation request
            and will get back to you within{" "}
            <span className="text-accent font-semibold">24 hours</span>.
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="text-accent" size={20} />
                <h3 className="font-semibold text-white">Check Your Email</h3>
              </div>
              <p className="text-sm text-slate-400">
                You'll receive a confirmation email shortly with next steps.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-accent" size={20} />
                <h3 className="font-semibold text-white">We'll Schedule</h3>
              </div>
              <p className="text-sm text-slate-400">
                I'll propose times based on your preferences and confirm via
                email.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <NewsletterForm source="consultation" />
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            While You Wait...
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>
                Check out my{" "}
                <Link to="/projects" className="text-accent hover:underline">
                  portfolio
                </Link>{" "}
                to see similar projects
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>
                Connect with me on{" "}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LinkedIn
                </a>{" "}
                or{" "}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Twitter
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>
                Read testimonials from{" "}
                <Link
                  to="/#testimonials"
                  className="text-accent hover:underline"
                >
                  satisfied clients
                </Link>
              </span>
            </li>
          </ul>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium"
          >
            Back to Homepage
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsultationSuccess;
