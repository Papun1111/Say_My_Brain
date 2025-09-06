"use client";

import { Link, deleteLink } from '../services/api';
import { MessageSquare, Trash2, Youtube, Twitter, Instagram, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface LinkCardProps {
  link: Link;
  onChat?: (link: Link) => void;
  refreshLinks?: () => void;
  isSharedView?: boolean; // New prop to indicate if it's a shared view
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'YOUTUBE': return <Youtube className="w-5 h-5 text-red-600" />;
    case 'X': return <Twitter className="w-5 h-5 text-sky-500" />;
    case 'INSTAGRAM': return <Instagram className="w-5 h-5 text-pink-500" />;
    default: return <Link2 className="w-5 h-5 text-zinc-500" />;
  }
};

export default function LinkCard({ link, onChat, refreshLinks, isSharedView = false }: LinkCardProps) {
  const handleDelete = async () => {
    if (!refreshLinks) return;
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
  
  // This effect tells Twitter's script to render any new tweets that are added to the page.
  useEffect(() => {
    if (link.platform === 'X' && link.embedHtml) {
      // @ts-ignore - 'twttr' is from an external script loaded in layout.tsx
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, [link.platform, link.embedHtml]);


  // --- CONDITIONAL RENDERING LOGIC ---

  // If the link is a tweet with embeddable HTML, render it directly.
  if (link.platform === 'X' && link.embedHtml) {
    return (
        <motion.div 
          // FIX: The container is simplified to prevent styling conflicts with the embed.
          className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col group relative"
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.2 }}
        >
            {/* FIX: This div now has no padding. The blockquote itself will be styled
              by Twitter's script, ensuring everything is visible.
            */}
            <div dangerouslySetInnerHTML={{ __html: link.embedHtml }} />
            
            {!isSharedView && (
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center mt-auto">
                    <button onClick={() => onChat?.(link)} className="flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-800 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Chat
                    </button>
                    <button onClick={handleDelete} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
        </motion.div>
    );
  }

  // Otherwise, render the standard card for YouTube, Instagram, etc.
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col group relative"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
        <img
          src={link.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview'}
          alt={link.title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Error'; }}
        />
      </a>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <PlatformIcon platform={link.platform} />
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">{link.platform}</span>
        </div>
        <h3 className="font-bold text-lg leading-tight text-zinc-900 mb-2 flex-grow">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 transition-colors">
            {link.title}
          </a>
        </h3>
        <p className="text-sm text-zinc-700 line-clamp-2">{link.description}</p>
      </div>
      
      {!isSharedView && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center mt-auto">
            <button onClick={() => onChat?.(link)} className="flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-800 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Chat
            </button>
            <button onClick={handleDelete} className="text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      )}
    </motion.div>
  );
}

