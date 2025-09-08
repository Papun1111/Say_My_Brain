"use client";
import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, ArrowLeft, Zap, Brain, Sparkles, Globe, Database, Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3eb] via-[#e9f0e5] to-[#f3f8f1] text-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: shouldReduceMotion ? 0.2 : 0.5,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="flex flex-wrap justify-between items-center gap-4 mb-10 p-4 rounded-2xl bg-gradient-to-r from-[#1f6032] to-[#093009] shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src="/logo.png"
                alt="Say My Brain Logo"
                width={240}
                height={60}
                className="h-12 w-auto md:h-14 cursor-pointer"
                priority
              />
            </Link>
          </div>
          
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-[#369457] hover:bg-[#29773e] text-[#fdfaf6] shadow-md transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.15,
            duration: shouldReduceMotion ? 0.2 : 0.5,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-[#fdfaf6] border border-[#d7e3d7] rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1f6032] mb-4">
                Say My Brain 
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Welcome to <strong>Say My Brain</strong>, a personal second-brain application designed to help you 
                <strong> save</strong>, <strong>organize</strong>, and <strong>interact</strong> with links from around the web.
              </p>
              <p className="text-lg text-gray-600 mt-4 max-w-4xl mx-auto">
                Upload content from platforms like <strong>YouTube</strong>, <strong>X (Twitter)</strong>, and <strong>Instagram</strong>, 
                and use the integrated <strong>Gemini AI</strong> to ask questions and gain insights from your saved knowledge.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-3xl font-bold text-[#1f6032] mb-8 text-center">
                 Features
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-gradient-to-br from-[#f0f6f0] to-[#e9f0e5] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-6 h-6 text-[#369457]" />
                    <h4 className="font-semibold text-[#1f6032]">Save & Organize</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Easily save links from various platforms in a clean, card-based UI.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f0f6f0] to-[#e9f0e5] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-[#369457]" />
                    <h4 className="font-semibold text-[#1f6032]">Automatic Previews</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Automatically fetch metadata like titles, descriptions, and thumbnails using oEmbed APIs and fallback scraping.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f0f6f0] to-[#e9f0e5] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="w-6 h-6 text-[#369457]" />
                    <h4 className="font-semibold text-[#1f6032]">AI-Powered Chat</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Engage with Gemini AI to summarize or ask questions about your saved content.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f0f6f0] to-[#e9f0e5] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="w-6 h-6 text-[#369457]" />
                    <h4 className="font-semibold text-[#1f6032]">Modern UI/UX</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Sleek, animated, and fully responsive interface built with Next.js, Tailwind CSS, and Framer Motion.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f0f6f0] to-[#e9f0e5] p-6 rounded-xl border border-[#d7e3d7] md:col-span-2 lg:col-span-1"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-[#369457]" />
                    <h4 className="font-semibold text-[#1f6032]">Containerized Development</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Entire app stack can be run using a single docker-compose command.
                  </p>
                </motion.div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#1f6032] mb-8 text-center">
                 How It Works
              </h3>
              
              <p className="text-lg text-gray-700 text-center mb-8">
                The application follows a <strong>client-server architecture</strong> containerized using Docker.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-gradient-to-br from-[#f9fdf9] to-[#f0f6f0] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <h4 className="text-xl font-semibold text-[#1f6032] mb-4">
                    1. Frontend (Next.js)
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Built with React and Tailwind CSS</li>
                    <li>• Users add links via the UI, which calls backend APIs</li>
                  </ul>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f9fdf9] to-[#f0f6f0] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <h4 className="text-xl font-semibold text-[#1f6032] mb-4">
                    2. Backend (Express)
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Node.js server fetches metadata (via oEmbed or scraping)</li>
                    <li>• Stores data in PostgreSQL via Prisma ORM</li>
                  </ul>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f9fdf9] to-[#f0f6f0] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <h4 className="text-xl font-semibold text-[#1f6032] mb-4">
                    3. Database (PostgreSQL)
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Stores metadata like title, description, thumbnails, platform, etc.</li>
                  </ul>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-[#f9fdf9] to-[#f0f6f0] p-6 rounded-xl border border-[#d7e3d7]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                >
                  <h4 className="text-xl font-semibold text-[#1f6032] mb-4">
                    4. AI Interaction (Gemini)
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• When prompted, the backend retrieves saved context and sends it + your prompt to Gemini Pro API for a smart response</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
