import React from "react";
import { motion } from "framer-motion";

/**
 * Mini Loader - Use this for inline loading states within pages/components
 * Example: while fetching data in a section
 */
const MiniLoader = ({ text = "Loading...", size = "md" }) => {
  const sizes = {
    sm: {
      spinner: "w-6 h-6",
      text: "text-sm",
      dot: "w-1.5 h-1.5",
    },
    md: {
      spinner: "w-10 h-10",
      text: "text-base",
      dot: "w-2 h-2",
    },
    lg: {
      spinner: "w-16 h-16",
      text: "text-lg",
      dot: "w-3 h-3",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {/* Spinner */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`${currentSize.spinner} border-2 border-accent/30 border-t-accent rounded-full`}
        />
        <div className="absolute inset-0 bg-accent/10 rounded-full blur-md animate-pulse" />
      </div>

      {/* Loading Text with Dots */}
      {text && (
        <div className="flex items-center gap-2">
          <span className={`${currentSize.text} text-slate-300 font-medium`}>
            {text}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
                className={`${currentSize.dot} rounded-full bg-accent`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniLoader;
