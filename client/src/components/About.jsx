import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Briefcase, GraduationCap, Target, Code, Lightbulb, Rocket, Users, CheckCircle, TrendingUp, Heart, Zap } from "lucide-react";

// Fallback skills if API fails or initially
const initialSkills = [
  { name: "React & Next.js", level: 95, category: "Frontend" },
  { name: "Node.js & Express", level: 90, category: "Backend" },
  { name: "Tailwind CSS", level: 95, category: "Styling" },
  { name: "WordPress", level: 85, category: "CMS" },
  { name: "Research & Writing", level: 92, category: "Academic" },
  { name: "Grant Proposals", level: 88, category: "Writing" },
];

const stats = [
  { icon: Briefcase, value: 50, suffix: "+", label: "Projects Completed", color: "from-blue-500 to-cyan-500" },
  { icon: Award, value: 30, suffix: "+", label: "Happy Clients", color: "from-purple-500 to-pink-500" },
  { icon: GraduationCap, value: 5, suffix: "+", label: "Years Experience", color: "from-green-500 to-emerald-500" },
  { icon: Target, value: 100, suffix: "%", label: "Client Satisfaction", color: "from-yellow-500 to-orange-500" },
];

const journey = [
  {
    year: "2019",
    title: "Started Freelancing",
    description: "Began my journey in web development and academic services",
    icon: Rocket,
  },
  {
    year: "2021",
    title: "Expanded Services",
    description: "Added grant writing and documentation to service portfolio",
    icon: Lightbulb,
  },
  {
    year: "2023",
    title: "50+ Projects",
    description: "Reached milestone of 50+ successful project completions",
    icon: CheckCircle,
  },
  {
    year: "2024",
    title: "Growing Impact",
    description: "Helping businesses scale with innovative digital solutions",
    icon: TrendingUp,
  },
];

const values = [
  { icon: Heart, title: "Passion", description: "Driven by love for creating exceptional work" },
  { icon: Zap, title: "Innovation", description: "Always exploring cutting-edge technologies" },
  { icon: Users, title: "Collaboration", description: "Building strong partnerships with clients" },
  { icon: Target, title: "Excellence", description: "Committed to delivering top-quality results" },
];

const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const displayValue = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref}>
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

const About = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/skills`);
      const data = await response.json();
      if (data.success && data.skills && data.skills.length > 0) {
        const skillsWithCategory = data.skills.map(skill => ({
          ...skill,
          category: skill.category || "General"
        }));
        setSkills(skillsWithCategory);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  return (
    <section id="about" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Enhanced Background with Particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Get to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Know Me</span>
            </h2>
          </motion.div>
        </div>

        {/* Enhanced Stats Grid with Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl text-center hover:border-accent/50 transition-all group cursor-pointer overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <motion.div
                className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {React.createElement(stat.icon, { 
                  size: 28, 
                  className: `text-transparent bg-clip-text bg-gradient-to-br ${stat.color}` 
                })}
              </motion.div>
              <div className={`text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br ${stat.color}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About Content & Skills */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Transforming Ideas Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                Digital Reality
              </span>
            </h3>
            <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
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
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Let's Work Together</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>

          {/* Enhanced Skills */}
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredSkill(index)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  className="relative"
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-medium">
                        {skill.name}
                      </span>
                      {skill.category && (
                        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-full">
                          {skill.category}
                        </span>
                      )}
                    </div>
                    <motion.span
                      className="text-accent font-bold"
                      animate={{ scale: hoveredSkill === index ? 1.2 : 1 }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full relative"
                    >
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>


        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Values</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl hover:border-accent/50 transition-all group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors"
                >
                  {React.createElement(value.icon, { size: 28 })}
                </motion.div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {value.title}
                </h4>
                <p className="text-slate-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
