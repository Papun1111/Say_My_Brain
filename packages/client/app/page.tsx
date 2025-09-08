"use client";
import { useEffect, useState } from "react";
import {
  Link,
  User,
  getAllLinksForUser,
  registerUser,
  getMe,
} from "./services/api";
import LinkCard from "./components/LinkCard";
import AddLinkModal from "./components/AddLinkModal";
import { Button } from "./components/ui/Button";
import ChatDrawer from "./components/ChatDrawer";
import { Plus, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import SkeletonCard from "./components/ui/SkeletonCard";
import ShareBrain from "./components/ShareBrain";
import ViewSharedBrain from "./components/ViewSharedBrain";
import Image from "next/image";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [showContent, setShowContent] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  const handleOpenChat = (link: Link) => {
    setSelectedLink(link);
    setIsChatOpen(true);
  };

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        staggerChildren: shouldReduceMotion ? 0.05 : 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: shouldReduceMotion ? 400 : 300,
        damping: shouldReduceMotion ? 40 : 25,
        duration: shouldReduceMotion ? 0.2 : 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -10,
      scale: shouldReduceMotion ? 1 : 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const skeletonVariants: Variants = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

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
            <Image
              src="/logo.png"
              alt="Say My Brain Logo"
              width={240}
              height={60}
              className="h-12 w-auto md:h-14"
              priority
            />
          </div>
          
          <motion.button
            className="px-4 py-2 rounded-full bg-[#369457] hover:bg-[#29773e] text-[#fdfaf6] shadow-md transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            onClick={() => setIsModalOpen(true)}
            disabled={!user}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Link
          </motion.button>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {user ? (
            <ShareBrain shareId={user.shareId} />
          ) : (
            <div className="bg-[#f0f6f0] border border-[#d7e3d7] rounded-xl shadow animate-pulse h-32" />
          )}
          <ViewSharedBrain />
        </motion.div>

        <div style={{ minHeight: '400px' }}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                variants={skeletonVariants}
                initial="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    initial="visible"
                    exit="exit"
                  >
                    <SkeletonCard />
                  </motion.div>
                ))}
              </motion.div>
            ) : links.length > 0 ? (
              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate={showContent ? "visible" : "hidden"}
                exit="exit"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {links.map((link, index) => (
                  <motion.div
                    key={link.id}
                    variants={itemVariants}
                    layout
                    layoutId={`card-${link.id}`}
                    custom={index}
                  >
                    <LinkCard
                      link={link}
                      onChat={handleOpenChat}
                      refreshLinks={fetchLinks}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              !isLoading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0.2 : 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="text-center py-20 bg-[#fdfaf6] border border-[#d7e3d7] rounded-2xl shadow"
                >
                  <h2 className="text-xl font-semibold text-[#1f6032]">
                    Your brain is empty
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Click{" "}
                    <span className="font-medium text-[#29773e]">Add Link</span> to
                    save your first piece of knowledge.
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

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
      </div>

      <footer className="py-12 text-center text-sm text-gray-600">
        <div className="mx-8 md:mx-16 lg:mx-24 xl:mx-32 border-t border-dotted border-gray-400 mb-8"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="mb-6"
        >
          <div className="flex justify-center items-center gap-4">
            <motion.a
              href="/about"
              className="text-gray-600 hover:text-[#1f6032] transition-colors duration-200 hover:underline"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            >
              About
            </motion.a>
            <span className="text-gray-400">•</span>
            <motion.a
              href="https://mail.google.com/mail/?view=cm&to=gohanmohapatra@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#1f6032] transition-colors duration-200 hover:underline"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            >
              Contact
            </motion.a>
          </div>
        </motion.div>
        
        © {new Date().getFullYear()} SayMyBrain. All rights reserved.
      </footer>
    </div>
  );
}
