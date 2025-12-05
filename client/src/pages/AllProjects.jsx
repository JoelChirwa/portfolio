import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";

// Expanded project data
const allProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "A full-featured online store with cart functionality, payment integration, and admin dashboard.",
    longDescription:
      "Built a comprehensive e-commerce solution with React and Node.js featuring user authentication, shopping cart, Stripe payment integration, order management, and real-time inventory tracking.",
    tags: ["React", "Node.js", "Tailwind", "Stripe", "MongoDB"],
    date: "October 2024",
    featured: true,
  },
  {
    id: 2,
    title: "Academic Research Portal",
    category: "Academic Services",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "A centralized platform for accessing and managing academic resources.",
    longDescription:
      "Developed a comprehensive research management system with citation tools, collaborative features, and document organization capabilities.",
    tags: ["Research", "Writing", "Editing", "APA/MLA"],
    date: "September 2024",
    featured: true,
  },
  {
    id: 3,
    title: "Grant Proposal Suite",
    category: "Grant Writing",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Successful grant proposals that secured funding for non-profit organizations.",
    longDescription:
      "Created comprehensive grant proposals resulting in over $500K in funding for various non-profit organizations focused on education and community development.",
    tags: ["Proposal", "Funding", "Strategy", "Non-Profit"],
    date: "August 2024",
    featured: true,
  },
  {
    id: 4,
    title: "Corporate Website Redesign",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Modern corporate website with SEO optimization and content management.",
    longDescription:
      "Redesigned a corporate website improving user experience, page load speed by 60%, and implementing a custom CMS for easy content updates.",
    tags: ["WordPress", "SEO", "UX Design", "CMS"],
    date: "July 2024",
    featured: false,
  },
  {
    id: 5,
    title: "Data Migration Project",
    category: "Data Entry",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Large-scale data entry and migration for enterprise client.",
    longDescription:
      "Successfully migrated 50,000+ records from legacy systems to modern database with 99.9% accuracy, including data cleaning and validation.",
    tags: ["Data Entry", "Excel", "Database", "Migration"],
    date: "June 2024",
    featured: false,
  },
  {
    id: 6,
    title: "PDF Conversion Service",
    category: "PDF/Image Conversion",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Converted 100+ financial documents from PDF to editable Excel format.",
    longDescription:
      "Provided accurate PDF to Excel conversion services for financial statements, maintaining formatting and data integrity for automated processing.",
    tags: ["PDF", "Excel", "Data Conversion", "Accuracy"],
    date: "May 2024",
    featured: false,
  },
  {
    id: 7,
    title: "Restaurant Landing Page",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Beautiful, responsive landing page with online reservation system.",
    longDescription:
      "Created an elegant restaurant website featuring menu showcase, online reservations, and integration with delivery platforms.",
    tags: ["React", "Tailwind", "Responsive", "API Integration"],
    date: "April 2024",
    featured: false,
  },
  {
    id: 8,
    title: "Thesis Editing & Formatting",
    category: "Academic Services",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "PhD thesis editing, proofreading, and APA formatting.",
    longDescription:
      "Provided comprehensive editing services for doctoral thesis, ensuring adherence to APA 7th edition guidelines and academic writing standards.",
    tags: ["Editing", "APA", "Proofreading", "Academic"],
    date: "March 2024",
    featured: false,
  },
  {
    id: 9,
    title: "Business Plan Documentation",
    category: "Microsoft Word Services",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Professional business plan with financial projections and market analysis.",
    longDescription:
      "Created a comprehensive 50-page business plan with professional formatting, charts, and financial models for startup funding.",
    tags: ["Word", "Business Plan", "Formatting", "Professional"],
    date: "February 2024",
    featured: false,
  },
];

const AllProjects = () => {
  const [filter, setFilter] = React.useState("All");

  const categories = [
    "All",
    "Web Development",
    "Academic Services",
    "Grant Writing",
    "Data Entry",
    "PDF/Image Conversion",
    "Microsoft Word Services",
  ];

  const filteredProjects =
    filter === "All"
      ? allProjects
      : allProjects.filter((project) => project.category === filter);

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              All Projects
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Browse through my complete portfolio of work across web
              development, academic services, data processing, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === category
                    ? "bg-accent text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Showing {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-accent/50 transition-all"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-accent text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}

                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-accent text-sm font-medium flex items-center gap-1">
                      <Tag size={14} />
                      {project.category}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Calendar size={14} />
                      {project.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                    {project.longDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 text-sm text-accent hover:underline">
                      <ExternalLink size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life with the same
            quality and dedication.
          </p>
          <Link
            to="/#contact"
            className="inline-block px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AllProjects;
