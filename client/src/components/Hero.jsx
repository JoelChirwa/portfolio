import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";

import joelImage from "../assets/joel.webp";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Hi,{" "}
            <span className="inline-block">
              <Handshake className="inline-block text-accent" size={60} />
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
              I am Joel Chirwa
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-lg">
            I help businesses and individuals elevate their presence with
            premium Web Development, Documentations and Entry and Academic
            services.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              Start a Project <ArrowRight size={20} />
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
            >
              View My Work
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-2xl shadow-2xl border border-slate-700 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative group">
              <img
                src={joelImage}
                alt="Joel Chirwa"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 bg-slate-800/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Available for Work</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
