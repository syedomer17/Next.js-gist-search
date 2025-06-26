'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <Image
          src="/404-github.svg" // You can use a custom SVG or image here
          alt="404 Illustration"
          width={300}
          height={300}
          className="mb-8"
        />

        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 max-w-lg">
          The gist you're looking for got lost in the GitHubverse.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg shadow-lg font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            🔙 Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
