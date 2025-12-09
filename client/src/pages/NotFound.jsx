import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  ArrowRight,
  FolderOpen,
  Mail,
  Phone,
  Code,
  FileText,
} from "lucide-react";
import usePageTracking from "../hooks/usePageTracking";

const NotFound = () => {
  usePageTracking("404 Error");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Popular links
  const popularPages = [
    {
      title: "Home",
      path: "/",
      icon: <Home size={20} />,
      description: "Return to homepage",
    },
    {
      title: "Projects",
      path: "/projects",
      icon: <FolderOpen size={20} />,
      description: "View my portfolio",
    },
    {
      title: "Skills",
      path: "/skills",
      icon: <Code size={20} />,
      description: "Explore my expertise",
    },
    {
      title: "Consultation",
      path: "/consultation",
      icon: <Phone size={20} />,
      description: "Book a consultation",
    },
  ];

  // Auto-redirect countdown
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search logic - redirect to relevant pages based on keywords
      const query = searchQuery.toLowerCase();
      if (query.includes("project")) {
        navigate("/projects");
      } else if (query.includes("skill")) {
        navigate("/skills");
      } else if (query.includes("contact") || query.includes("consultation")) {
        navigate("/consultation");
      } else if (query.includes("blog")) {
        navigate("/blog");
      } else {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-pink-500 animate-gradient">
                404
              </span>
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              The page you're looking for seems to have wandered off into the
              digital void. Don't worry though, we'll help you find your way
              back!
            </p>
          </motion.div>

          {/* Auto-redirect notice */}
          {autoRedirect && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-lg inline-block"
            >
              <p className="text-accent text-sm">
                Redirecting to homepage in{" "}
                <span className="font-bold text-lg">{countdown}</span> seconds
              </p>
              <button
                onClick={() => setAutoRedirect(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors mt-2 underline"
              >
                Cancel auto-redirect
              </button>
            </motion.div>
          )}

          {/* Search Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pages, projects, skills..."
                className="w-full pl-12 pr-32 py-4 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
              >
                Search
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Popular Pages Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-center mb-6">
            Try these popular pages:
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {popularPages.map((page, index) => (
              <motion.div
                key={page.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={page.path}
                  onClick={() => setAutoRedirect(false)}
                  className="block p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-accent/50 transition-all group"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                    {page.icon}
                  </div>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    {page.title}
                    <ArrowRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                    />
                  </h4>
                  <p className="text-sm text-slate-400">{page.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 text-center"
        >
          <FileText className="mx-auto mb-4 text-accent" size={32} />
          <h3 className="text-xl font-bold mb-2">
            Still can't find what you're looking for?
          </h3>
          <p className="text-slate-400 mb-6">
            Get in touch and I'll help you find exactly what you need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/#contact"
              onClick={() => setAutoRedirect(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Mail size={18} />
              Contact Me
            </Link>
            <Link
              to="/"
              onClick={() => setAutoRedirect(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Home size={18} />
              Go Home
            </Link>
          </div>
        </motion.div>

        {/* Fun Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 text-sm font-mono">
            Error Code: 404 | Page Not Found | The resource you requested does
            not exist
          </p>
        </motion.div>
      </div>

      {/* Custom CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
