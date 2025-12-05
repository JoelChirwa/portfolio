import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  FileText,
  PenTool,
  BookOpen,
  Database,
  FileSpreadsheet,
} from "lucide-react";

const services = [
  {
    icon: <Code size={40} />,
    title: "Web Development",
    description:
      "Custom websites, web apps, responsive design, and WordPress solutions tailored to your needs.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: <FileText size={40} />,
    title: "Microsoft Word Services",
    description:
      "Professional document creation, editing, formatting, templates, and design.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    icon: <Database size={40} />,
    title: "Data Entry",
    description:
      "Accurate and efficient data entry services, data processing, and database management.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: <FileSpreadsheet size={40} />,
    title: "PDF/Image to Excel/Word",
    description:
      "Convert PDFs and images to editable Excel spreadsheets or Word documents with precision.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: <PenTool size={40} />,
    title: "Grant Writing",
    description:
      "Expert proposal writing, research, and submission support to help you secure funding.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: <BookOpen size={40} />,
    title: "Academic Services",
    description:
      "Research assistance, essays, editing, and referencing for academic excellence.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">My Services</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive solutions designed to meet your professional and
            academic needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-all hover:-translate-y-2 group"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${service.bg} ${service.color} group-hover:scale-110 transition-transform`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
