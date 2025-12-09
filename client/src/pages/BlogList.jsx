import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Tag,
  User,
  ArrowRight,
  Search,
  AlertCircle,
  Eye,
} from "lucide-react";
import usePageTracking from "../hooks/usePageTracking";
import MiniLoader from "../components/MiniLoader";

const BlogList = () => {
  // Track page view
  usePageTracking("Blog");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs?published=true`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setError("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Web Development",
    "Academic Services",
    "Grant Writing",
    "Microsoft Word",
    "Data Entry",
    "Freelancing Tips",
    "Technology",
    "Business",
  ];

  // Filter blogs by search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured blog (most recent published)
  const featuredBlog = blogs.find((blog) => blog.isPublished) || null;

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Blog</span> & Insights
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-8">
              Discover tips, tutorials, and insights on web development,
              freelancing, academic services, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors backdrop-blur-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog */}
      {featuredBlog && !searchQuery && selectedCategory === "All" && (
        <section className="py-16 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="gradient-text">Featured</span> Article
              <div className="h-1 flex-1 bg-gradient-to-r from-accent to-transparent rounded"></div>
            </h2>

            <Link to={`/blog/${featuredBlog.slug}`}>
              <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-accent/50 transition-all">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={
                        featuredBlog.featuredImage ||
                        "https://via.placeholder.com/800x600/1e293b/38bdf8?text=Featured+Blog"
                      }
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium border border-accent/20">
                        {featuredBlog.category}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(
                          featuredBlog.publishedDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent transition-colors">
                      {featuredBlog.title}
                    </h3>

                    <p className="text-slate-400 text-lg mb-6 line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {featuredBlog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {featuredBlog.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {featuredBlog.views || 0} views
                        </span>
                      </div>

                      <span className="text-accent font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-accent text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Showing {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <MiniLoader text="Loading blog posts" size="lg" />
          ) : error ? (
            <div className="flex items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <div className="group h-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-accent/50 transition-all card-hover">
                      {/* Image */}
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={
                            blog.featuredImage ||
                            "https://via.placeholder.com/600x400/1e293b/38bdf8?text=Blog+Post"
                          }
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1 bg-accent/90 text-slate-900 rounded-full text-xs font-bold backdrop-blur-sm">
                          {blog.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Meta Info */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(blog.publishedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {blog.readTime} min
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {blog.views || 0}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700"
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-xs text-slate-500">
                                +{blog.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Author & Read More */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <span className="text-sm text-slate-500 flex items-center gap-2">
                            <User size={14} />
                            {blog.author}
                          </span>
                          <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center glass p-12 rounded-3xl relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss an Update
            </h2>
            <p className="text-slate-400 mb-8">
              Subscribe to get the latest articles, tutorials, and insights
              delivered straight to your inbox.
            </p>
            <Link
              to="/#newsletter"
              className="inline-block px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
            >
              Subscribe to Newsletter
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
