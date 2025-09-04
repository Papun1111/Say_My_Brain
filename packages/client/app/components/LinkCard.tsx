"use client";

import { Link, deleteLink } from '../services/api';
import { MessageSquare, Trash2, Youtube, Twitter, Instagram, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

interface LinkCardProps {
  link: Link;
  onChat: (link: Link) => void;
  refreshLinks: () => void;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'YOUTUBE': return <Youtube className="w-5 h-5 text-red-500" />;
    case 'X': return <Twitter className="w-5 h-5 text-sky-500" />;
    case 'INSTAGRAM': return <Instagram className="w-5 h-5 text-pink-500" />;
    default: return <Link2 className="w-5 h-5 text-slate-500" />;
  }
};

export default function LinkCard({ link, onChat, refreshLinks }: LinkCardProps) {
  const handleDelete = async () => {
    // A simple confirmation dialog. For a better user experience,
    // this could be replaced with a custom modal.
    if (window.confirm("Are you sure you want to delete this link?")) {
      try {
        await deleteLink(link.id);
        toast.success("Link deleted!");
        refreshLinks();
      } catch (error) {
        toast.error("Failed to delete link.");
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md flex flex-col group"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
        <img
          src={link.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview'}
          alt={link.title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview';
          }}
        />
      </a>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <PlatformIcon platform={link.platform} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{link.platform}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight mb-2 flex-grow">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-black hover:text-sky-600 transition-colors">
            {link.title}
          </a>
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2">{link.description}</p>
      </div>
      <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex justify-between items-center">
        <motion.button 
          onClick={() => onChat(link)} 
          className="flex items-center gap-2 text-sm text-sky-600 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </motion.button>
        <motion.button 
          onClick={handleDelete} 
          className="text-slate-400"
          whileHover={{ scale: 1.1, color: 'rgb(239 68 68)' }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

