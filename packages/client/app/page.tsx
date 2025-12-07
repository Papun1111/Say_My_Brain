"use client";
import { useEffect, useState, useRef } from "react";
import {
  Link as LinkType,
  User,
  getAllLinksForUser,
  registerUser,
  getMe,
} from "./services/api";
// --- ORIGINAL IMPORTS KEPT INTACT ---
import LinkCard from "./components/LinkCard";
import AddLinkModal from "./components/AddLinkModal";
import ChatDrawer from "./components/ChatDrawer";
import { Plus, ArrowUpRight } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useReducedMotion
} from "framer-motion";
import SkeletonCard from "./components/ui/SkeletonCard";
import ShareBrain from "./components/ShareBrain";
import ViewSharedBrain from "./components/ViewSharedBrain";
import Image from "next/image";
import Dither from "./components/ui/Dither";

// --- ANIMATION COMPONENTS (New Aesthetic) ---

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

export default function HomePage() {
  // --- ORIGINAL STATE & LOGIC (Unchanged) ---
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);
  const [showContent, setShowContent] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // --- PARALLAX SCROLL HOOKS ---
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  useEffect(() => {
    const initUser = async () => {
      let token = localStorage.getItem("authToken");
      if (!token) {
        try {
          const { token: newToken, shareId } = await registerUser();
          token = newToken;
          localStorage.setItem("authToken", token);
          setUser({ id: "", shareId });
        } catch (error) {
          console.error("Failed to register new user:", error);
          setIsLoading(false);
          return;
        }
      }
      try {
        const userData = await getMe();
        setUser(userData);
        fetchLinks();
      } catch (error) {
        console.error("Authentication failed, clearing token.", error);
        localStorage.removeItem("authToken");
        setIsLoading(false);
      }
    };
    initUser();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      setShowContent(false);
      const data = await getAllLinksForUser();
      setLinks(data);
      
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }, 300);
    } catch (error) {
      console.error("Failed to fetch links for user", error);
      setIsLoading(false);
    }
  };

  const handleOpenChat = (link: LinkType) => {
    setSelectedLink(link);
    setIsChatOpen(true);
  };

  // --- RENDERING ---

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#22c55e] selection:text-black overflow-x-hidden font-sans">
      
      {/* 1. BACKGROUND LAYERS (Dither + Parallax) */}
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
        className="fixed top-24 left-0 w-full z-0 flex justify-center items-center pointer-events-none"
      >
        <h1 className="text-[22vw] leading-none font-black text-[#151515] tracking-tighter whitespace-nowrap select-none">
          SYSTEM
        </h1>
      </motion.div>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-6 py-6 md:px-12 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 bg-[#0a0a0a]/80"
        >
          <div className="flex items-center gap-3">
             {/* Styled Logo Area */}
             <div className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-8 h-auto invert opacity-90" />
                <span>SayMy<span className="text-[#22c55e]">Brain</span></span>
             </div>
          </div>
          
          <motion.button
            className="group relative flex justify-center align-middle overflow-hidden px-6 py-2 ml-0.5 rounded-sm bg-[#22c55e] text-black font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
            onClick={() => setIsModalOpen(true)}
            disabled={!user}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex justify-center items-center gap-2">
               <Plus className="w-4 h-4" /> Initialize Link
            </span>
          </motion.button>
        </motion.header>

        {/* HERO SECTION (Split Layout) */}
        <motion.section 
          style={{ y: yHero }}
          className="px-6 md:px-12 pt-16 pb-20 flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12"
        >
          {/* LEFT: Typography */}
          <div className="flex-1 space-y-6 relative">
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 border border-white/20 text-[10px] uppercase tracking-wider text-gray-400">Memory</span>
               <span className="px-2 py-1 border border-white/20 text-[10px] uppercase tracking-wider text-gray-400">Archive</span>
               <span className="px-2 py-1 bg-[#22c55e] text-black font-bold text-[10px] uppercase tracking-wider">Active</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mix-blend-difference">
              Second<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">Brain</span>
            </h2>

            <p className="max-w-lg text-gray-400 text-sm md:text-base border-l-2 border-[#22c55e] pl-4 mt-8 font-mono">
              // STORE. CHAT. RECALL.<br/>
              The external hard drive for your consciousness.
            </p>
          </div>

          {/* RIGHT: Functional Components as "HUD Panels" */}
          <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-6 shrink-0">
             {/* We wrap the original components in styled containers to fit the dark theme */}
             
             {/* Panel 1: Share Brain */}
             <div className="flex-1 sm:w-80 bg-[#111] border border-white/10 p-4 rounded-sm hover:border-white/20 transition-colors relative group">
                <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                </div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-mono">Outgoing Signal</h4>
                <div className="relative z-10 invert-0">
                    {user ? <ShareBrain shareId={user.shareId} /> : <div className="h-10 bg-white/5 animate-pulse rounded"/>}
                </div>
             </div>

             {/* Panel 2: View Shared Brain */}
             <div className="flex-1 sm:w-80 bg-[#111] border border-white/10 p-4 rounded-sm hover:border-white/20 transition-colors relative">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-mono">Incoming Feed</h4>
                <div className="relative z-10">
                    <ViewSharedBrain />
                </div>
             </div>
          </div>
        </motion.section>

        {/* MARQUEE SEPARATOR */}
        <div className="w-full bg-[#22c55e] text-black py-3 transform -rotate-1 shadow-[0_0_50px_rgba(34,197,94,0.2)] z-20 border-y-4 border-black">
          <ParallaxText baseVelocity={-2}>
            NEURAL LINK ESTABLISHED • UPLOAD KNOWLEDGE • ACCESS ANYWHERE • 
          </ParallaxText>
        </div>

        {/* MAIN LINKS GRID */}
        <div className="px-6 md:px-12 py-24 min-h-[600px] bg-gradient-to-b from-[#0a0a0a] to-black">
           <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
             <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
               Data <span className="text-[#22c55e]">Log</span>
             </h3>
             <div className="text-xs font-mono text-gray-500">
                {links.length} ENTRIES FOUND
             </div>
           </div>

           <AnimatePresence mode="wait">
             {isLoading ? (
               <motion.div 
                 key="skeleton"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
               >
                 {Array.from({ length: 8 }).map((_, i) => (
                   <div key={i} className="opacity-50">
                     {/* Using the Original Skeleton Component */}
                     <SkeletonCard />
                   </div>
                 ))}
               </motion.div>
             ) : links.length > 0 ? (
               <motion.div 
                 key="content"
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
               >
                 {links.map((link, i) => (
                   <motion.div
                     key={link.id}
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.4, delay: i * 0.05 }}
                     layoutId={`card-${link.id}`}
                     className="group"
                   >
                     {/* Custom Wrapper for the LinkCard to force dark mode consistency */}
                     <div className="relative h-full bg-[#111] border border-white/10 hover:border-[#22c55e] transition-all duration-300 rounded-lg overflow-hidden group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                       
                       {/* Hover Action Icon */}
                       <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                         <div className="bg-[#22c55e] text-black p-1 rounded-full">
                           <ArrowUpRight size={14} />
                         </div>
                       </div>

                       {/* The Original LinkCard Component */}
                       <div className="h-full [&>div]:bg-transparent [&>div]:text-gray-300 [&_h3]:text-white [&_p]:text-gray-400">
                         <LinkCard
                           link={link}
                           onChat={handleOpenChat}
                           refreshLinks={fetchLinks}
                         />
                       </div>
                     </div>
                   </motion.div>
                 ))}
               </motion.div>
             ) : (
               !isLoading && (
                 <motion.div
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-lg bg-white/5"
                 >
                   <h2 className="text-3xl font-black uppercase tracking-widest text-white/20">Empty Drive</h2>
                   <p className="text-gray-500 mt-2 font-mono text-sm">Initiate first data sequence via the top menu.</p>
                 </motion.div>
               )
             )}
           </AnimatePresence>
        </div>

        {/* FOOTER */}
        <footer className="relative z-10 py-12 border-t border-white/10 bg-black text-center">
            <div className="flex justify-center items-center gap-8 mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                <a href="/about" className="hover:text-[#22c55e] transition-colors">About</a>
                <span className="text-[#22c55e]">•</span>
                <a href="#" className="hover:text-[#22c55e] transition-colors">Contact</a>
            </div>
            <div className="text-[10px] text-gray-700 font-mono">
              SECURE CONNECTION // ENCRYPTED
              <br/>
              © {new Date().getFullYear()} SAY MY BRAIN
            </div>
        </footer>
      </div>

      {/* MODALS (Kept Original) */}
      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLinkAdded={fetchLinks}
      />
      {selectedLink && (
        <ChatDrawer
          link={selectedLink}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Global Style for Outline Text */}
      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
          color: transparent;
        }
      `}</style>
    </div>
  );
}