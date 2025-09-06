"use client";

import { useEffect, useState } from 'react';
import { Link, User, getAllLinksForUser, registerUser, getMe } from './services/api';
import LinkCard from './components/LinkCard';
import AddLinkModal from './components/AddLinkModal';
import { Button } from './components/ui/Button';
import ChatDrawer from './components/ChatDrawer';
import { Plus, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonCard from './components/ui/SkeletonCard';
import ShareBrain from './components/ShareBrain';
import ViewSharedBrain from './components/ViewSharedBrain';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);

  // This effect handles the entire user session flow on initial load.
  useEffect(() => {
    const initUser = async () => {
      let token = localStorage.getItem('authToken');
      
      // If no token exists, register a new anonymous user.
      if (!token) {
        try {
          console.log("No token found, registering new user...");
          const { token: newToken, shareId } = await registerUser();
          token = newToken;
          localStorage.setItem('authToken', token);
          setUser({ id: '', shareId }); // Optimistically set user for immediate UI feedback
        } catch (error) {
            console.error("Failed to register new user:", error);
            setIsLoading(false); // Stop loading if registration fails
            return;
        }
      }

      // With a token, fetch the user's data to verify and get their shareId.
      try {
        const userData = await getMe();
        setUser(userData);
        fetchLinks(); // Fetch links only after user is confirmed
      } catch (error) {
        console.error("Authentication failed, clearing token.", error);
        localStorage.removeItem('authToken');
        // Optionally, you could try to re-register the user here.
        setIsLoading(false);
      }
    };
    initUser();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const data = await getAllLinksForUser();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links for user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = (link: Link) => {
    setSelectedLink(link);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#dddddd]">
      <div className="container mx-auto p-4 md:p-8">
        <motion.header 
          className="flex flex-wrap justify-between items-center gap-4 mb-10 p-6 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg"
        >
          <div className='flex items-center gap-4'>
            <BrainCircuit className="w-9 h-9 text-sky-300" />
            <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Say My Brain</h1>
          </div>
          <Button variant='ghost' onClick={() => setIsModalOpen(true)} disabled={!user}>
            <Plus className="w-5 h-5 mr-2" />
            Add Link
          </Button>
        </motion.header>

        {/* New section for sharing components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {user ? <ShareBrain shareId={user.shareId} /> : <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse h-32"></div>}
          <ViewSharedBrain />
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : links.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {links.map((link) => (
                <LinkCard key={link.id} link={link} onChat={handleOpenChat} refreshLinks={fetchLinks} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-slate-700">Your brain is empty!</h2>
              <p className="text-slate-500 mt-2">Click "Add Link" to save your first piece of knowledge.</p>
            </div>
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

