import React from "react";
import { Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a
              href="#home"
              className="text-2xl font-bold text-white tracking-tighter"
            >
              Joel<span className="text-accent">.</span>
            </a>
            <Link to="/admin/dashboard" target="_blank">
              <p className="text-slate-500 mt-2 text-sm">
                © {new Date().getFullYear()} Joel Portfolio. All rights
                reserved.
              </p>
            </Link>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com/JoelChirwa"
              className="text-slate-400 hover:text-accent transition-colors"
              target="_blank"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/joel-chirwa-199308209/"
              className="text-slate-400 hover:text-accent transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
