import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star, Image as ImageIcon } from "lucide-react";

// Fallback data
const initialTestimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Outstanding web development work! The website exceeded our expectations and has significantly improved our online presence. Highly professional and responsive.",
  },
  {
    name: "Dr. Michael Chen",
    role: "University Professor",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "Exceptional academic writing and research assistance. The quality of work is always top-notch, well-researched, and delivered on time. A true professional!",
  },
  {
    name: "Emily Rodriguez",
    role: "Non-Profit Director",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text: "We secured funding thanks to their excellent grant proposal writing! Their expertise and attention to detail made all the difference. Couldn't be happier!",
  },
  {
    name: "James Wilson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 5,
    text: "Amazing document design and formatting services. My business proposals now look incredibly professional. Fast turnaround and great communication throughout.",
  },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setTestimonials(data);
        }
      }
    } catch (error) {
      console.error(
        "Error fetching testimonials, utilizing fallback data:",
        error
      );
    }
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-slate-900/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Client Testimonials
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say
              about working with me.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-accent/50 transition-all hover:-translate-y-1 group relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/20 group-hover:text-accent/40 transition-colors">
                <Quote size={48} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                {testimonial.image && !testimonial.isAnonymous ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-accent/30 object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-2 border-accent/30 bg-slate-800 flex items-center justify-center text-slate-500">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-white">
                    {testimonial.isAnonymous
                      ? "Verified Client"
                      : testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {testimonial.isAnonymous
                      ? "Confidential"
                      : testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-block bg-slate-800/50 border border-slate-700 px-6 py-3 rounded-full">
            <span className="text-accent font-bold text-lg">4.9/5.0</span>
            <span className="text-slate-400 ml-2">Average Client Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
