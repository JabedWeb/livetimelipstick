"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Elevate Your Style with <br />
            <span className="text-teal-400">Custom Sunglasses & Lipsticks</span>
          </h1>
          <p className="text-gray-400 mt-6 text-lg">
            Experience real-time customization. Try on, design, and shop with confidence.
          </p>
     <div className="mt-8 space-x-4 flex flex-wrap justify-center">
        <Link
            href="/sunglass"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-teal-400 transition"
        >
            Try Sunglasses (Webcam)
        </Link>

        <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
        >
            Customize 3D Sunglasses
        </a>

        <Link
            href="/lipstickshop"
            className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
        >
            Try Lipstick
        </Link>
    </div>

    </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#111]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            {
              title: "Live 3D View",
              desc: "Visualize your customization in real-time before adding to cart.",
            },
            {
              title: "Virtual Try-On",
              desc: "Use your webcam to try on sunglasses and lipstick effortlessly.",
            },
            {
              title: "Express Checkout",
              desc: "Streamlined ordering and premium delivery options.",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-black border border-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-400">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-black via-[#111] to-black py-20 text-center px-6">
        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Discover the power of personalization
        </motion.h2>
        <p className="text-gray-400 mb-6">
          Designed by you. Rendered in real-time. Delivered with confidence.
        </p>
        <Link
          href="/sunglass"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-teal-500 hover:text-white transition"
        >
          Launch Experience →
        </Link>
      </section>
    </div>
  );
}
