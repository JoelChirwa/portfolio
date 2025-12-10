import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Briefcase, GraduationCap, Target } from "lucide-react";

// Fallback skills if API fails or initially
const initialSkills = [
  { name: "React & Next.js", level: 95 },
  { name: "Node.js & Express", level: 90 },
  { name: "Tailwind CSS", level: 95 },
  { name: "WordPress", level: 85 },
  { name: "Research & Writing", level: 92 },
  { name: "Grant Proposals", level: 88 },
];

const stats = [
  { icon: <Briefcase size={24} />, value: "50+", label: "Projects Completed" },
  { icon: <Award size={24} />, value: "30+", label: "Happy Clients" },
  { icon: <GraduationCap size={24} />, value: "5+", label: "Years Experience" },
  { icon: <Target size={24} />, value: "100%", label: "Client Satisfaction" },
];

const About = () => {
  const [skills, setSkills] = useState(initialSkills);
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
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">About Me</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A passionate professional dedicated to delivering excellence in
              web development, academic services, and grant writing.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center hover:border-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-accent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About Content & Skills */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Transforming Ideas Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                Digital Reality
              </span>
            </h3>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                I'm a versatile freelancer specializing in web development,
                academic services, and grant writing. With over 5 years of
                experience, I've helped businesses and individuals achieve their
                goals through innovative solutions and meticulous attention to
                detail.
              </p>
              <p>
                My expertise spans modern web technologies like React, Node.js,
                and Tailwind CSS, as well as professional document creation,
                academic research, and successful grant proposal writing. I
                pride myself on delivering high-quality work that exceeds
                expectations.
              </p>
              <p>
                Whether you need a stunning website, expert academic assistance,
                or a compelling grant proposal, I bring creativity,
                professionalism, and dedication to every project.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-block mt-6 px-8 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Let's Work Together
            </a>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Skills & Expertise</h3>
              <Link
                to="/skills"
                className="text-accent hover:text-accent/80 text-sm font-medium transition-colors flex items-center gap-1 group"
              >
                See All
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-accent font-bold">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
