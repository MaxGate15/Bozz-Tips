'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen px-6 flex flex-col justify-center items-center space-y-10 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-200">
      <motion.div
        className="bg-white rounded-3xl shadow-xl px-10 py-12 flex flex-col items-center space-y-8 max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl font-extrabold leading-tight text-black mb-2"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Us
        </motion.h1>

        <motion.p
          className="text-lg text-blue-900 font-medium text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Bozz Tips is a trusted football prediction platform dedicated to providing accurate, data-driven betting tips. Our team of experienced analysts delivers daily free and premium (VVIP) tips across various markets including Full-Time, HT/FT, Over/Under, and Correct Score. With a strong focus on transparency, consistency, and community, we help bettors make smarter decisions and improve their chances of winning. Join us and take your betting strategy to the next level.
        </motion.p>

        {/* <motion.a
          href="/projects"
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
        >
          View Projects
        </motion.a> */}
      </motion.div>

      {/* Contact Us Section */}
      <motion.div
        className="mt-10 w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
        <a
          href="https://t.me/bozztipsadmin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-lg"
        >
          Contact us on Telegram: @bozztipsadmin
        </a>
      </motion.div>
    </main>
  );
}
