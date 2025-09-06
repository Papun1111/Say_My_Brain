"use client";

import { useEffect, useState } from 'react';
import { Link } from './services/api';
import { getAllLinks } from './services/api';
import LinkCard from './components/LinkCard';
import AddLinkModal from './components/AddLinkModal';
import { Button } from './components/ui/Button';
import ChatDrawer from './components/ChatDrawer';
import { Plus, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Animation variants for the container of the cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each individual card
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function HomePage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const data = await getAllLinks();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenChat = (link: Link) => {
    setSelectedLink(link);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-800">
      <div className="container mx-auto p-4 md:p-8">
        <motion.header 
          className="flex flex-wrap justify-between items-center gap-4 mb-10 p-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex items-center gap-4'>
            <BrainCircuit className="w-9 h-9 text-sky-300" />
            <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Say My Brain</h1>
          </div>
          <Button variant='ghost' onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Link
          </Button>
        </motion.header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              className="text-center py-10 text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading your brain...
            </motion.div>
          ) : links.length > 0 ? (
            <motion.div 
              key="link-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {links.map((link) => (
                <motion.div key={link.id} variants={itemVariants}>
                  <LinkCard link={link} onChat={() => handleOpenChat(link)} refreshLinks={fetchLinks} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty-state"
              className="text-center py-20 bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2 className="text-xl font-semibold text-slate-700">Your brain is empty!</h2>
              <p className="text-slate-500 mt-2">Click "Add Link" to save your first piece of knowledge.</p>
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
}

