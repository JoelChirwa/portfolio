import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, FileSearch, Pencil, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Lightbulb size={32} />,
    number: "01",
    title: "Discovery & Consultation",
    description:
      "Understanding your needs, goals, and project requirements. Whether it's a website, document, research, or data project, I take time to align with your vision.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <FileSearch size={32} />,
    number: "02",
    title: "Planning & Research",
    description:
      "Conducting thorough research, gathering requirements, and creating a clear roadmap. This ensures accuracy for data entry, relevance for academic work, and effectiveness for all projects.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Pencil size={32} />,
    number: "03",
    title: "Execution & Creation",
    description:
      "Bringing your project to life with precision and quality. From coding websites, formatting documents, converting files, writing proposals, to conducting research—excellence is guaranteed.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <CheckCircle size={32} />,
    number: "04",
    title: "Review & Delivery",
    description:
      "Thorough quality checks, revisions based on feedback, and timely delivery. You receive polished, professional results ready to use with ongoing support when needed.",
    color: "from-orange-500 to-red-500",
  },
];

const Process = () => {
  return (
    <section
      id="process"
      className="py-20 bg-slate-900/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How I Work</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A proven process across all services ensuring quality results,
              accuracy, and seamless collaboration from start to finish.
            </p>
          </motion.div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connector Line (hidden on mobile, shown on larger screens) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-700 to-transparent -z-10" />
              )}

              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-accent/50 transition-all group h-full">
                {/* Number Badge */}
                <div
                  className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm mb-4`}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-slate-800/50 rounded-xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-300 mb-4">
            Ready to start your project with a proven process?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-accent to-purple-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
