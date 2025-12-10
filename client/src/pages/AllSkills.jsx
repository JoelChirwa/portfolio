import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code,
  Palette,
  Server,
  Database,
  Wrench,
  FileText,
  AlertCircle,
  Search,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import usePageTracking from "../hooks/usePageTracking";
import MiniLoader from "../components/MiniLoader";

// Fallback skills if API fails
const fallbackSkills = [
  { name: "React & Next.js", level: 95, category: "Frontend", icon: "Code" },
  { name: "Node.js & Express", level: 90, category: "Backend", icon: "Server" },
  { name: "Tailwind CSS", level: 95, category: "Frontend", icon: "Palette" },
  { name: "WordPress", level: 85, category: "CMS", icon: "Wrench" },
  {
    name: "Research & Writing",
    level: 92,
    category: "Writing",
    icon: "FileText",
  },
  { name: "Grant Proposals", level: 88, category: "Writing", icon: "FileText" },
  { name: "MongoDB", level: 85, category: "Database", icon: "Database" },
  {
    name: "JavaScript/TypeScript",
    level: 92,
    category: "Frontend",
    icon: "Code",
  },
  { name: "REST APIs", level: 90, category: "Backend", icon: "Server" },
  { name: "Git & GitHub", level: 88, category: "Tools", icon: "Wrench" },
];

const AllSkills = () => {
  // Track page view
  usePageTracking("All Skills");
  const [skills, setSkills] = useState(fallbackSkills);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();

      if (data.success && data.skills && data.skills.length > 0) {
        setSkills(data.skills);
      } else {
        // Use fallback skills if API doesn't return any
        console.log("Using fallback skills");
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setError("Using offline skills data");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from skills
  const categories = [
    "All",
    ...new Set(skills.map((skill) => skill.category || "Other")),
  ];

  // Filter skills based on category and search query
  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = filter === "All" || skill.category === filter;
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get icon component based on name
  const getIconComponent = (iconName) => {
    const icons = {
      Code: Code,
      Palette: Palette,
      Server: Server,
      Database: Database,
      Wrench: Wrench,
      FileText: FileText,
      Award: Award,
    };
    const IconComponent = icons[iconName] || Code;
    return <IconComponent size={24} />;
  };

  // Get skill level color and label
  const getSkillLevelInfo = (level) => {
    if (level >= 90)
      return { label: "Expert", color: "from-green-400 to-emerald-500" };
    if (level >= 75)
      return { label: "Advanced", color: "from-blue-400 to-cyan-500" };
    if (level >= 60)
      return { label: "Intermediate", color: "from-purple-400 to-pink-500" };
    return { label: "Beginner", color: "from-orange-400 to-amber-500" };
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10">
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
            <h1 className="text-4xl text-center md:text-6xl font-bold mb-4">
              Skills & Expertise
            </h1>
            <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto">
              A comprehensive overview of my technical skills, tools, and
              expertise across various domains.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center"
            >
              <div className="text-3xl font-bold text-accent mb-1">
                {skills.length}+
              </div>
              <div className="text-sm text-slate-400">Total Skills</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center"
            >
              <div className="text-3xl font-bold text-accent mb-1">
                {skills.filter((s) => s.level >= 90).length}
              </div>
              <div className="text-sm text-slate-400">Expert Level</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center col-span-2 md:col-span-1"
            >
              <div className="text-3xl font-bold text-accent mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm text-slate-400">Categories</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-4">
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

          <p className="text-slate-400 text-sm">
            Showing {filteredSkills.length}{" "}
            {filteredSkills.length === 1 ? "skill" : "skills"}
          </p>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <MiniLoader text="Loading skills" size="lg" />
          ) : error && skills.length === 0 ? (
            <div className="flex items-center justify-center p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400">
                No skills found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => {
                const levelInfo = getSkillLevelInfo(skill.level);
                return (
                  <motion.div
                    key={skill._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group bg-slate-900/50 border border-slate-800 hover:border-accent/50 p-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-accent/10"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                          {getIconComponent(skill.icon)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">
                            {skill.name}
                          </h3>
                          {skill.category && (
                            <span className="text-xs text-slate-400">
                              {skill.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Level Badge */}
                    <div className="mb-4">
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${levelInfo.color} text-white`}
                      >
                        {levelInfo.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Proficiency
                        </span>
                        <span className="text-sm font-bold text-accent">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{
                            delay: index * 0.05 + 0.2,
                            duration: 1,
                          }}
                          className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Description if available */}
                    {skill.description && (
                      <p className="text-sm text-slate-400 mt-3">
                        {skill.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Build Something Amazing
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            With this diverse skill set, I can help bring your project to life.
            Let's discuss how we can work together.
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

export default AllSkills;
