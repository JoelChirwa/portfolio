import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap, Database, Globe, Terminal, Brackets, Cpu, Zap as ZapIcon } from "lucide-react";

const Hero = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const skills = [
    { 
      icon: Code2, 
      name: "Web Development", 
      description: "React, Vue, Node.js",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10"
    },
    { 
      icon: Database, 
      name: "Documentation", 
      description: "Technical & Professional",
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-500/10"
    },
    { 
      icon: Globe, 
      name: "Academic Services", 
      description: "Writing & Research",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10"
    },
    { 
      icon: Cpu, 
      name: "Full Stack", 
      description: "Frontend & Backend",
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-500/10"
    },
  ];

  const techStack = [
    { name: "React", delay: 0 },
    { name: "Node.js", delay: 0.1 },
    { name: "MongoDB", delay: 0.2 },
    { name: "TypeScript", delay: 0.3 },
    { name: "Tailwind", delay: 0.4 },
    { name: "REST API", delay: 0.5 },
  ];

  useEffect(() => {
    const skillInterval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 4000);

    return () => clearInterval(skillInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const FloatingOrb = ({ delay, position, size }) => (
    <motion.div
      className={`absolute rounded-full blur-3xl`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: [0, 30, -30, 0],
        y: [0, -40, 40, 0],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 md:pt-20 pb-12 md:pb-0 overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950" />
        
        {/* Animated Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-accent"/>
        </svg>

        {/* Floating Tech Orbs */}
        <FloatingOrb 
          delay={0} 
          position={{ top: "10%", right: "10%" }} 
          size={400}
        />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        
        <FloatingOrb 
          delay={2} 
          position={{ bottom: "10%", left: "5%" }} 
          size={500}
        />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left Side - Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Status Badge */}
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Build Your
                </motion.span>
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Digital Future
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-base md:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Full-stack developer & technical specialist. I create modern web applications, 
                comprehensive documentation, and academic solutions that drive results.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-4"
            >
              <motion.a
                href="#contact"
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center md:justify-start gap-2 group relative overflow-hidden text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start a Project</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#portfolio"
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={20} />
                View Work
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Side - Tech Stack & Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block space-y-6"
          >
            {/* Status Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ borderColor: "rgb(var(--color-accent))", backgroundColor: "rgb(var(--color-accent) / 0.2)" }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-accent"
              />
              <span className="text-sm font-medium text-accent">Available for projects</span>
            </motion.div>

            {/* Central Animated Shape */}
            <div className="relative h-80 md:h-96 flex items-center justify-center">
              {/* Animated Code Window */}
              <motion.div
                className="relative w-full max-w-sm md:max-w-md"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-slate-900/80 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
                  {/* Window Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono">portfolio.jsx</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm space-y-2">
                    <div className="text-slate-400">
                      <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> <span className="text-slate-400">=</span> <span className="text-orange-400">{'{}'}</span>
                    </div>
                    <div className="text-slate-400 pl-4">
                      <span className="text-cyan-400">skills</span><span className="text-slate-400">: [</span>
                    </div>
                    <AnimatePresence mode="wait">
                      {techStack.map((tech, idx) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: tech.delay }}
                          className="text-slate-400 pl-8"
                        >
                          <span className="text-green-400">"{tech.name}"</span><span className="text-slate-400">,</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="text-slate-400 pl-4">
                      <span className="text-slate-400">],</span>
                    </div>
                    <div className="text-slate-400">
                      <span className="text-orange-400">{'}'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Skill Badges */}
              {[
                { label: "React", top: "10%", left: "5%", delay: 0 },
                { label: "Node.js", top: "15%", right: "8%", delay: 0.2 },
                { label: "Tailwind", bottom: "20%", left: "0%", delay: 0.4 },
                { label: "MongoDB", bottom: "15%", right: "5%", delay: 0.1 },
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  className="absolute px-3 py-1 bg-slate-800/80 border border-accent/30 rounded-full text-xs text-accent font-semibold backdrop-blur-sm"
                  style={{
                    top: badge.top,
                    bottom: badge.bottom,
                    left: badge.left,
                    right: badge.right,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3 + badge.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: badge.delay,
                  }}
                >
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-sm text-slate-400">Scroll to explore</p>
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

