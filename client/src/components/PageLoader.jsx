import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "../context/LoaderContext";

const PageLoader = ({ fullScreen = true }) => {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "relative w-full h-full"
      } bg-slate-950 flex items-center justify-center`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Logo / Brand Initial */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="relative"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-accent border-r-accent/50"
          />

          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-2 w-28 h-28 rounded-full border-3 border-transparent border-b-accent/80 border-l-accent/40"
          />

          {/* Inner Circle with Photo */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center backdrop-blur-sm border-2 border-accent/30 overflow-hidden">
            <motion.img
              src="/Joel.jpg"
              alt="Joel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Pulsing Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-32 h-32 rounded-full bg-accent/20 blur-xl"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="flex flex-col items-center gap-4"
        >
          <h2 className="text-2xl font-bold text-white">Loading</h2>

          {/* Animated Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -12, 0],
                  backgroundColor: [
                    "rgba(var(--accent-rgb), 0.3)",
                    "rgba(var(--accent-rgb), 1)",
                    "rgba(var(--accent-rgb), 0.3)",
                  ],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-3 h-3 rounded-full bg-accent/30"
              />
            ))}
          </div>
        </motion.div>

        {/* Progress Bar (Optional) */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "240px" }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="relative h-1 bg-slate-800 rounded-full overflow-hidden w-60"
        >
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
          }}
          animate={{
            y: -50,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear",
          }}
          className="absolute w-1 h-1 bg-accent/40 rounded-full"
          style={{
            boxShadow: "0 0 10px rgba(var(--accent-rgb), 0.5)",
          }}
        />
      ))}
    </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
