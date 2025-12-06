"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame, useReducedMotion } from "framer-motion";
import { BrainCircuit, ArrowLeft, Zap, Brain, Sparkles, Globe, Database, Bot, Cpu, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Dither from "../components/ui/Dither";

// --- REUSED ANIMATION COMPONENTS ---

function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 select-none">
      <motion.div className="flex whitespace-nowrap flex-nowrap uppercase text-4xl md:text-6xl font-black tracking-tighter items-center" style={{ x }}>
        <span className="block mr-12 text-transparent stroke-text">{children} </span>
        <span className="block mr-12 text-transparent stroke-text">{children} </span>
        <span className="block mr-12 text-transparent stroke-text">{children} </span>
        <span className="block mr-12 text-transparent stroke-text">{children} </span>
      </motion.div>
    </div>
  );
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

// --- MAIN COMPONENT ---

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax effects
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-[#22c55e] selection:text-black overflow-x-hidden font-sans">
      
      {/* 1. BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
        <Dither
          waveColor={[0.15, 0.15, 0.15]} 
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.4}
          colorNum={2}
          pixelSize={3}
          waveAmplitude={0.4}
          waveSpeed={0.02}
        />
      </div>

      <motion.div 
        style={{ y: yTitle }}
        className="fixed top-32 left-0 w-full z-0 flex justify-center items-center pointer-events-none"
      >
        <h1 className="text-[20vw] leading-none font-black text-[#151515] tracking-tighter whitespace-nowrap select-none">
          SOURCE
        </h1>
      </motion.div>

      {/* 2. CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-6 py-6 md:px-12 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 bg-[#050505]/80"
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <div className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                 <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-8 h-auto invert opacity-90" />
                 <span>SayMy<span className="text-[#22c55e]">Brain</span></span>
              </div>
            </Link>
          </div>
          
          <Link
            href="/"
            className="group px-4 py-2 rounded-sm border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-black font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Abort Mission
          </Link>
        </motion.header>

        {/* HERO INTRO */}
        <motion.div 
           style={{ y: yContent }}
           className="px-6 md:px-12 pt-16 pb-20 max-w-7xl mx-auto w-full"
        >
          <div className="border-l-4 border-[#22c55e] pl-6 md:pl-12 py-4 mb-20 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6"
            >
              Project <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-white">Overview</span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-3xl font-mono leading-relaxed"
            >
              <p className="mb-4">
                <strong className="text-white">SAY MY BRAIN</strong> is a classified second-brain protocol designed to 
                <span className="text-[#22c55e]"> capture</span>, <span className="text-[#22c55e]">organize</span>, and <span className="text-[#22c55e]">interrogate</span> data streams from the open web.
              </p>
              <p>
                Upload intelligence from <strong>YouTube</strong>, <strong>X</strong>, and <strong>Instagram</strong>. Deploy <strong>Gemini AI</strong> to extract tactical insights.
              </p>
            </motion.div>
          </div>

          {/* FEATURES GRID */}
          <div className="mb-24">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] bg-[#22c55e] w-12"></div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-white">System Capabilities</h3>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={<Globe />} 
                  title="Universal Capture" 
                  desc="Ingest links from any sector of the internet into a unified, card-based interface."
                  delay={0}
                />
                <FeatureCard 
                  icon={<Sparkles />} 
                  title="Auto-Scraping" 
                  desc="Autonomous metadata retrieval. Titles, descriptions, and thumbnails fetched via oEmbed & fallback protocols."
                  delay={1}
                />
                <FeatureCard 
                  icon={<Bot />} 
                  title="Neural Chat" 
                  desc="Direct uplink to Gemini AI. Summarize content and query your database via natural language."
                  delay={2}
                />
                <FeatureCard 
                  icon={<BrainCircuit />} 
                  title="Modern UI" 
                  desc="High-performance interface. Built on Next.js 14 architecture with Framer Motion physics."
                  delay={3}
                />
                <FeatureCard 
                  icon={<Cpu />} 
                  title="Containerized" 
                  desc="Full stack encapsulation. Deploy the entire mainframe with a single Docker command."
                  delay={4}
                  className="md:col-span-2 lg:col-span-2"
                />
             </div>
          </div>
        </motion.div>

        {/* MARQUEE SEPARATOR */}
        <div className="w-full bg-[#22c55e] text-black py-3 transform rotate-1 shadow-[0_0_50px_rgba(34,197,94,0.2)] z-20 border-y-4 border-black mb-20">
          <ParallaxText baseVelocity={2}>
            SYSTEM ARCHITECTURE • POSTGRESQL • NODE.JS • PRISMA ORM • NEXT.JS • 
          </ParallaxText>
        </div>

        {/* ARCHITECTURE SECTION */}
        <div className="px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center mb-16 text-center">
              <Terminal className="w-12 h-12 text-[#22c55e] mb-4" />
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                 Operational <span className="text-[#22c55e]">Workflow</span>
              </h3>
              <p className="mt-4 text-gray-500 font-mono text-sm uppercase tracking-widest">
                Dockerized Client-Server Topology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <TechCard 
                 number="01" 
                 title="Frontend Core" 
                 specs={["Next.js Framework", "React Library", "Tailwind Styling"]} 
               />
               <TechCard 
                 number="02" 
                 title="Backend Server" 
                 specs={["Node.js Runtime", "Express API", "Prisma ORM Layer"]} 
               />
               <TechCard 
                 number="03" 
                 title="Data Vault" 
                 specs={["PostgreSQL DB", "Metadata Storage", "Persistent Memory"]} 
               />
               <TechCard 
                 number="04" 
                 title="AI Uplink" 
                 specs={["Gemini Pro API", "Context Injection", "Smart Synthesis"]} 
               />
            </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-auto border-t border-white/10 bg-black py-12 px-6 text-center">
            <div className="text-[10px] text-gray-600 font-mono">
              SECURE CONNECTION // ENCRYPTED <br/>
              © {new Date().getFullYear()} SAY MY BRAIN // SYSTEM VERSION 3.0
            </div>
        </footer>
      </div>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
          color: transparent;
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ icon, title, desc, className = "", delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1 }}
      className={`bg-[#111] border border-white/10 p-6 rounded-sm hover:border-[#22c55e] transition-colors duration-300 group ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-white/5 rounded-full text-[#22c55e] group-hover:text-white group-hover:bg-[#22c55e] transition-colors shadow-[0_0_10px_rgba(34,197,94,0)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
          {icon}
        </div>
        <h4 className="font-bold text-white uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
    </motion.div>
  );
}

function TechCard({ number, title, specs }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-[#0a0a0a] border border-dashed border-white/20 p-8 rounded-sm hover:bg-[#111] transition-colors"
    >
      <div className="absolute top-4 right-4 text-4xl font-black text-white/5 select-none">{number}</div>
      <h4 className="text-xl font-bold text-[#22c55e] mb-6 uppercase tracking-wider border-b border-white/10 pb-2 inline-block">
        {title}
      </h4>
      <ul className="space-y-3 font-mono text-sm text-gray-400">
        {specs.map((spec: string, i: number) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full"></span>
            {spec}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}