import React from "react";
import { Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-2">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-3">
          {/* Left: Brand & Copyright */}
          <div className="text-center md:text-left">
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

          {/* Center: Payment Methods */}
          <div className="flex flex-col items-center">
            <h4 className="text-center text-slate-500 text-xs font-medium mb-3">
              Accepted Payments
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {/* National Bank */}
              <div className="group relative">
                <img
                  src="/nb.png"
                  alt="National Bank"
                  className="h-8 w-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Airtel Money */}
              <div className="group relative">
                <img
                  src="/airtel-money.jpeg"
                  alt="Airtel Money"
                  className="h-8 w-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* TNM Mpamba */}
              <div className="group relative">
                <img
                  src="/tnm-mpamba.jpeg"
                  alt="TNM Mpamba"
                  className="h-8 w-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* PayPal */}
              <div className="group relative">
                <svg
                  className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors opacity-60 group-hover:opacity-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.76-4.852a.932.932 0 0 1 .922-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.72-4.46z" />
                </svg>
              </div>

              {/* Binance */}
              <div className="group relative">
                <svg
                  className="h-8 w-8 text-yellow-400 group-hover:text-yellow-300 transition-colors opacity-60 group-hover:opacity-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Social Links */}
          <div className="flex justify-center md:justify-end space-x-6">
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
