import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Eye,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import usePageTracking from "../hooks/usePageTracking";
import MiniLoader from "../components/MiniLoader";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Track page view
  usePageTracking(blog ? `Blog: ${blog.title}` : "Blog Post");

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      incrementViews();
      fetchRelatedBlogs();
    }
  }, [blog?.slug]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/slug/${slug}`);
      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
      } else {
        setError("Blog post not found");
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(`${API_URL}/api/blogs/${blog._id}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/blogs?published=true&category=${blog.category}&limit=3`
      );
      const data = await response.json();

      if (data.success) {
        // Filter out current blog
        const related = data.blogs.filter((b) => b.slug !== blog.slug);
        setRelatedBlogs(related.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch related blogs:", error);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <MiniLoader text="Loading article" size="lg" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || "Blog post not found"}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link to="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <ChevronRight size={16} />
            <span className="text-slate-500">{blog.category}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Category */}
            <div className="mb-6">
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-slate-400 text-lg md:text-xl mb-8">
              {blog.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <User size={16} />
                {blog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(blog.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {blog.readTime} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {blog.views || 0} views
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.featuredImage && (
        <section className="container mx-auto px-6 -mt-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>
      )}

      {/* Article Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Share Button - Sticky */}
            <div className="hidden lg:block absolute -left-20 top-0">
              <div className="sticky top-32">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent/50 transition-colors relative"
                >
                  <Share2 size={20} />

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute left-full ml-2 top-0 bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-col gap-2 min-w-[120px] shadow-xl">
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded transition-colors text-sm"
                      >
                        <Facebook size={16} />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded transition-colors text-sm"
                      >
                        <Twitter size={16} />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded transition-colors text-sm"
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded transition-colors text-sm"
                      >
                        <Link2 size={16} />
                        {copySuccess ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div
              className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-accent prose-code:bg-slate-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
              prose-ul:text-slate-300 prose-ol:text-slate-300
              prose-li:marker:text-accent
              prose-blockquote:border-l-accent prose-blockquote:bg-slate-900/50 prose-blockquote:py-1
              prose-img:rounded-xl prose-img:border prose-img:border-slate-800"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 hover:border-accent/50 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Mobile Share Buttons */}
          <div className="lg:hidden mt-12 flex items-center justify-center gap-4">
            <span className="text-slate-400 text-sm">Share:</span>
            <button
              onClick={() => handleShare("facebook")}
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent/50 transition-colors"
            >
              <Facebook size={20} />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent/50 transition-colors"
            >
              <Twitter size={20} />
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent/50 transition-colors"
            >
              <Linkedin size={20} />
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent/50 transition-colors"
            >
              <Link2 size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-slate-900/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Related <span className="gradient-text">Articles</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/blog/${relatedBlog.slug}`}>
                    <div className="group h-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-accent/50 transition-all card-hover">
                      {/* Image */}
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={
                            relatedBlog.featuredImage ||
                            "https://via.placeholder.com/600x400/1e293b/38bdf8?text=Blog+Post"
                          }
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <span className="text-xs text-accent font-medium">
                          {relatedBlog.category}
                        </span>
                        <h3 className="text-lg font-bold mt-2 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {relatedBlog.readTime} min
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {relatedBlog.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/blog"
                className="inline-block px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-lg hover:border-accent/50 transition-all"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center glass p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-slate-400 mb-8">
              Let's bring your project to life with the same expertise and
              dedication you've read about.
            </p>
            <Link
              to="/consultation"
              className="inline-block px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all hover:scale-105"
            >
              Book a Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
