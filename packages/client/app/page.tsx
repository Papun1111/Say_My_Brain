"use client";

import { useEffect, useState } from 'react';
import { Link } from './services/api';
import { getAllLinks } from './services/api';
import LinkCard from './components/LinkCard';
import AddLinkModal from './components/AddLinkModal';
import { Button } from './components/ui/Button';
import ChatDrawer from './components/ChatDrawer';
import { Plus, BrainCircuit } from 'lucide-react';

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
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className='flex items-center gap-3'>
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900">Second Brain</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </header>

      {isLoading ? (
         <div className="text-center py-10 text-slate-500">Loading your brain...</div>
      ) : links.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} onChat={() => handleOpenChat(link)} refreshLinks={fetchLinks} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700">No links yet!</h2>
            <p className="text-slate-500 mt-2">Click "Add Link" to save your first piece of knowledge.</p>
        </div>
      )}

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
  );
}

