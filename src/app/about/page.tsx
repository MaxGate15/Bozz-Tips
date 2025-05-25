'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen px-3 sm:px-6 flex flex-col justify-center items-start sm:items-center space-y-6 sm:space-y-8 bg-[#FFF8F0] text-black">
      <motion.h1
        className="text-3xl sm:text-5xl font-bold leading-tight text-left sm:text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Bozz Tips
      </motion.h1>

      <motion.p
        className="text-base sm:text-lg max-w-xs sm:max-w-xl text-gray-800 text-left sm:text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Smart insights. Sharp strategies. Welcome to your next favorite portfolio.
      </motion.p>

      <motion.a
        href="/projects"
        className="inline-block bg-orange-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-orange-600 transition text-base sm:text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View Projects
      </motion.a>
    </main>
  );
}
