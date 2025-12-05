import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, MessageCircle } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent/20 to-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 p-12 md:p-16 rounded-3xl text-center"
          >
            {/* Badge */}
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <span className="text-accent font-medium">Ready to Start?</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Let's Build Something{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                Amazing Together
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you need a cutting-edge website, expert academic
              assistance, or a winning grant proposal, I'm here to help bring
              your vision to life. Let's discuss your project today!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#contact"
                className="group px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all flex items-center gap-2 hover:gap-3 shadow-lg hover:shadow-accent/20"
              >
                Start a Project
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Divider */}
            <div className="my-10 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Download Resume */}
            <div>
              <p className="text-slate-400 mb-4">
                Want to know more about my experience?
              </p>
              <a
                href="/resume.pdf"
                download="Joel_Chirwa_Resume.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 text-accent font-medium rounded-lg hover:bg-slate-800 transition-colors border border-accent/30"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute bottom-10 right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
