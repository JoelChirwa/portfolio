import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "I offer a comprehensive range of freelance services including Web Development (responsive websites, web applications, e-commerce), Microsoft Word Services (document formatting, templates, reports), Grant Writing (proposals, applications), Academic Services (research papers, assignments), Data Entry, and PDF/Image Conversion services.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "Project timelines vary based on complexity and scope. A simple website takes 1-2 weeks, while complex web applications may take 4-6 weeks. Document formatting typically takes 1-3 days. Grant proposals require 1-2 weeks. I always provide a detailed timeline during our initial consultation and strive to deliver on or before the agreed deadline.",
    },
    {
      question: "What are your rates?",
      answer:
        "My rates are competitive and depend on the project scope, complexity and timeline. Simple projects start from $15, while comprehensive web development projects range from $500-$3000+. I offer both hourly rates and fixed project pricing. Contact me for a free quote tailored to your specific needs.",
    },
    {
      question: "Do you offer revisions?",
      answer:
        "Yes! I believe in delivering work that exceeds your expectations. All projects include a reasonable number of revisions (typically 2-3 rounds) at no extra cost. Additional revisions beyond the agreed scope can be accommodated at a nominal fee. Your satisfaction is my priority.",
    },
    {
      question: "What is your payment process?",
      answer:
        "I typically work with a 50% upfront deposit before starting the project and 50% upon completion. For larger projects, we can arrange milestone-based payments. I accept payments via PayPal, bank transfer, or mobile money. All payment terms are clearly outlined in our contract before work begins.",
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer:
        "Absolutely! I offer a complimentary support period (typically 30 days) after project delivery for bug fixes and minor adjustments. Beyond that, I provide affordable monthly maintenance packages for websites and ongoing support for other services. I'm committed to your long-term success.",
    },
    {
      question: "Can you work with clients from different time zones?",
      answer:
        "Yes! I work with clients globally and am flexible with communication schedules. I'm based in Malawi (CAT/GMT+2) but can accommodate meetings during your preferred hours. I respond to messages typically within 2-4 hours during business days and provide regular project updates.",
    },
    {
      question: "What makes you different from other freelancers?",
      answer:
        "I combine technical expertise with excellent communication and reliability. You'll get personalized attention, transparent pricing, regular updates, and high-quality deliverables. I don't just complete projects—I build lasting relationships. My diverse skill set means you can trust me with various needs, making me your one-stop solution.",
    },
    {
      question: "How do we get started?",
      answer:
        "Getting started is easy! Simply reach out via the contact form, WhatsApp, or email with your project details. We'll schedule a free consultation call to discuss your needs, timeline, and budget. I'll then provide a detailed proposal and quote. Once approved, we sign an agreement and begin work immediately!",
    },
    {
      question: "Do you sign NDAs and contracts?",
      answer:
        "Yes, absolutely! I understand the importance of confidentiality and professionalism. I'm happy to sign Non-Disclosure Agreements (NDAs) and work contracts. For every project, I provide a clear service agreement outlining deliverables, timelines, payment terms, and confidentiality clauses to protect both parties.",
    },
  ];

  const toggleFAQ = async (index) => {
    // Track FAQ click
    if (openIndex !== index) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
        await fetch(`${API_URL}/api/analytics/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: `FAQ: ${faqs[index].question}`,
            path: window.location.pathname,
            sessionId:
              sessionStorage.getItem("analytics_session_id") ||
              `session_${Date.now()}`,
            referrer: "FAQ Click",
          }),
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    }

    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
            <HelpCircle size={20} className="text-accent" />
            <span className="text-accent font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions? I've got answers. Find everything you need to know
            about working with me.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div
                className={`bg-slate-900 border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  openIndex === index
                    ? "border-accent shadow-lg shadow-accent/20"
                    : "border-slate-800 hover:border-slate-700"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                {/* Question */}
                <div className="flex items-start justify-between p-6 gap-4">
                  <h3 className="text-lg font-semibold text-white flex-1 pr-4">
                    {faq.question}
                  </h3>
                  <button
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                      openIndex === index
                        ? "bg-accent text-slate-900 rotate-180"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                    aria-label={openIndex === index ? "Close" : "Open"}
                  >
                    {openIndex === index ? (
                      <Minus size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </button>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px bg-slate-800 mb-4" />
                        <p className="text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">
            Still have questions? I'm here to help!
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-accent text-slate-900 font-bold rounded-lg hover:bg-accent/90 transition-all transform hover:-translate-y-1"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
