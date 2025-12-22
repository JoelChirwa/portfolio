import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap, Database, Globe, Terminal } from "lucide-react";

import joelImage from "../assets/joel.webp";

const Hero = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [terminalText, setTerminalText] = useState("");
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState(0);
  
  const skills = [
    { icon: Code2, name: "Web Development", color: "from-blue-500 to-cyan-500" },
    { icon: Database, name: "Documentation", color: "from-green-500 to-emerald-500" },
    { icon: Globe, name: "Academic Services", color: "from-purple-500 to-pink-500" },
  ];

  const terminalCommands = [
    "$ npm run build",
    "$ Building portfolio...",
    "$ ✓ Compiled successfully!",
    "$ Ready to elevate your business"
  ];

  const codeSnippets = [
    { 
      lang: "JavaScript", 
      code: "const success = await\n  buildAmazingProject();",
      color: "text-yellow-400"
    },
    { 
      lang: "React", 
      code: "<Portfolio>\n  <Innovation />\n</Portfolio>",
      color: "text-cyan-400"
    },
    { 
      lang: "Node.js", 
      code: "app.use(excellence);\napp.listen(success);",
      color: "text-green-400"
    },
  ];

  useEffect(() => {
    const skillInterval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 3000);

    return () => clearInterval(skillInterval);
  }, []);

  useEffect(() => {
    const codeInterval = setInterval(() => {
      setCurrentCodeSnippet((prev) => (prev + 1) % codeSnippets.length);
    }, 4000);

    return () => clearInterval(codeInterval);
  }, []);

  useEffect(() => {
    let currentCommand = 0;
    let currentChar = 0;
    
    const typeInterval = setInterval(() => {
      if (currentCommand < terminalCommands.length) {
        if (currentChar < terminalCommands[currentCommand].length) {
          setTerminalText(prev => prev + terminalCommands[currentCommand][currentChar]);
          currentChar++;
        } else {
          setTerminalText(prev => prev + "\n");
          currentCommand++;
          currentChar = 0;
          if (currentCommand >= terminalCommands.length) {
            setTimeout(() => {
              setTerminalText("");
              currentCommand = 0;
            }, 2000);
          }
        }
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={joelImage}
          alt="Joel Chirwa"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle overlay for better contrast */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side - Refined Content with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-accent" size={16} />
            </motion.div>
            <span className="text-sm text-accent font-medium">Available for Projects</span>
          </motion.div>

          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSkill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${skills[currentSkill].color} flex items-center gap-3`}
                >
                  <motion.div
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {React.createElement(skills[currentSkill].icon, { className: "inline-block", size: 44 })}
                  </motion.div>
                  {skills[currentSkill].name}
                </motion.span>
              </AnimatePresence>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Elevating businesses and individuals with premium Web Development, 
              Documentation and Academic services. Let's build something extraordinary together.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <motion.a
              href="#contact"
              className="px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all flex items-center gap-2 shadow-lg shadow-accent/20 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start a Project</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
            <motion.a
              href="#portfolio"
              className="px-8 py-4 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-all border border-slate-700 flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={20} className="group-hover:text-accent transition-colors" />
              View My Work
            </motion.a>
          </div>
        </motion.div>

        {/* Right Side - Code Carousel & Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block space-y-4"
        >
          {/* Code Snippet Carousel */}
          <div className="relative z-10 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentCodeSnippet}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-xs text-slate-400 font-mono"
                >
                  {codeSnippets[currentCodeSnippet].lang}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="p-6 font-mono text-sm h-28 flex items-center">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={currentCodeSnippet}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`whitespace-pre-wrap ${codeSnippets[currentCodeSnippet].color}`}
                >
                  {codeSnippets[currentCodeSnippet].code}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="relative z-10 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">terminal</span>
              </div>
            </div>
            <div className="p-6 font-mono text-sm text-green-400 h-36 overflow-hidden">
              <pre className="whitespace-pre-wrap">{terminalText}<span className="animate-pulse">_</span></pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
