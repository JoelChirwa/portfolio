import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

// Fallback data
const initialProjects = [
  {
    title: "E-Commerce Platform",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "A full-featured online store with cart functionality and payment integration.",
    tags: ["React", "Node.js", "Tailwind"],
  },
  {
    title: "Academic Research Portal",
    category: "Academic Services",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "A centralized platform for accessing and managing academic resources.",
    tags: ["Research", "Writing", "Editing"],
  },
  {
    title: "Grant Proposal Suite",
    category: "Grant Writing",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description:
      "Successful grant proposals that secured funding for non-profit organizations.",
    tags: ["Proposal", "Funding", "Strategy"],
  },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(initialProjects);


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch featured projects only
      const response = await fetch(`${API_URL}/api/projects?featured=true`);
      const data = await response.json();

      if (data.success && data.projects && data.projects.length > 0) {
        // Take only top 3 featured projects
        setProjects(data.projects.slice(0, 3));
      } else {
        // Fallback: try fetching all and taking top 3
        const allResponse = await fetch(`${API_URL}/api/projects`);
        const allData = await allResponse.json();
        if (
          allData.success &&
          allData.projects &&
          allData.projects.length > 0
        ) {
          setProjects(allData.projects.slice(0, 3));
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured Work
            </h2>
            <p className="text-slate-400 max-w-xl">
              A selection of projects that showcase my expertise across
              different domains.
            </p>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-accent font-medium hover:underline mt-4 md:mt-0"
          >
            View All Projects <ExternalLink size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            >
              {/* Project Image */}
              <div className="aspect-video overflow-hidden bg-slate-700">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                  {project.title}
                </h3>

                {/* Action Links */}
                <div className="flex flex-col gap-3">
                  {project.category === "Web Development" && project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  ) : (
                    <Link
                      to={`/projects/${project._id || project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
                    >
                      <ExternalLink size={18} />
                      See More Details
                    </Link>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
                    >
                      <Github size={18} />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
          >
            View All Projects <ExternalLink size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
