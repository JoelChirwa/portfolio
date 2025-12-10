import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import usePageTracking from "../hooks/usePageTracking";
import MiniLoader from "../components/MiniLoader";

const AllProjects = () => {
  // Track page view
  usePageTracking("All Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      ? projects
      : projects.filter((project) => project.category === filter);

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
          {loading ? (
            <MiniLoader text="Loading projects" size="lg" />
          ) : error ? (
            <div className="flex items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400">
                No projects found in this category.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || index}
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

                    {/* Client Name */}
                    {project.clientName && !project.isAnonymous && (
                      <div className="mb-2 text-xs text-slate-400 font-medium">
                        Client:{" "}
                        <span className="text-slate-300">
                          {project.clientName}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags &&
                        project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-accent hover:underline"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                          <Github size={16} />
                          Source Code
                        </a>
                      )}
                    </div>
                    {/* Anonymity note - optional, only if relevant */}
                    {project.isAnonymous && (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        * Client details confidential
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
