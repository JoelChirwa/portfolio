import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, FileSearch, Pencil, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    number: "01",
    title: "Discovery & Consultation",
    description:
      "Understanding your needs, goals, and project requirements. Whether it's a website, document, research, or data project, I take time to align with your vision.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Planning & Research",
    description:
      "Conducting thorough research, gathering requirements, and creating a clear roadmap. This ensures accuracy for data entry, relevance for academic work, and effectiveness for all projects.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    icon: Pencil,
    number: "03",
    title: "Execution & Creation",
    description:
      "Bringing your project to life with precision and quality. From coding websites, formatting documents, converting files, writing proposals, to conducting research—excellence is guaranteed.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Review & Delivery",
    description:
      "Thorough quality checks, revisions based on feedback, and timely delivery. You receive polished, professional results ready to use with ongoing support when needed.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
];

const Process = () => {
  return (
    <section
      id="process"
      className="py-20 bg-slate-950 relative overflow-hidden"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        
        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-accent text-sm font-medium">My Process</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              How I <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Work</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A proven process across all services ensuring quality results,
              accuracy, and seamless collaboration from start to finish.
            </p>
          </motion.div>
        </div>

        {/* Process Steps - Vertical Timeline on Mobile, Horizontal on Desktop */}
        <div className="relative">
          {/* Vertical Timeline Line for Mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-purple-500 to-transparent md:hidden" />
          
          {/* Horizontal Timeline Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-purple-500 to-accent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`absolute -left-2 md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${step.color} z-10 shadow-lg`}
                  whileHover={{ scale: 1.5 }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  viewport={{ once: true }}
                />

                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`ml-12 md:ml-0 bg-slate-900/70 backdrop-blur-sm border ${step.borderColor} p-6 rounded-2xl hover:border-accent/50 transition-all group h-full cursor-pointer relative overflow-hidden`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  {/* Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={`px-4 py-1 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {step.number}
                    </motion.div>
                    <ArrowRight className="text-slate-600 group-hover:text-accent transition-colors" size={20} />
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mb-4 relative z-10`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {React.createElement(step.icon, { 
                      size: 32, 
                      className: `text-transparent bg-clip-text bg-gradient-to-br ${step.color}` 
                    })}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {step.description}
                  </p>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
            <p className="text-slate-300 mb-6">
              Let's bring your project to life with a proven process that delivers results.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-purple-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start Your Project</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-accent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
