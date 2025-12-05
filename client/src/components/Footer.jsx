import React from "react";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a
              href="#"
              className="text-2xl font-bold text-white tracking-tighter"
            >
              Joel<span className="text-accent">.</span>
            </a>
            <p className="text-slate-500 mt-2 text-sm">
              © {new Date().getFullYear()} Joel Portfolio. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-slate-400 hover:text-accent transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-accent transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-accent transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-accent transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
