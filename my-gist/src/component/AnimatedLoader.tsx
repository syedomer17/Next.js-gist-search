'use client';

import { motion } from 'framer-motion';

export const AnimatedLoader = () => {
  // Type-safe easing array (equivalent to easeInOut)
  const easeInOut: [number, number, number, number] = [0.445, 0.05, 0.55, 0.95];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
      {/* Spinner Circle */}
      <motion.div
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        aria-label="Loading spinner"
      />

      {/* Bouncing Dots */}
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ y: ['0%', '-50%', '0%'] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: easeInOut,
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Optional Loading Text */}
      <p className="text-gray-500 text-sm">Loading, please wait…</p>
    </div>
  );
};
