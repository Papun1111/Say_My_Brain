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
  isSharedView?: boolean;
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
  
  useEffect(() => {
    if (link.platform === 'X' && link.embedHtml) {
      // @ts-ignore - 'twttr' is from an external script loaded in layout.tsx
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, [link.platform, link.embedHtml]);

  // Twitter/X embed card
  if (link.platform === 'X' && link.embedHtml) {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col group relative min-h-[400px] max-h-[400px]"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Twitter embed container */}
        <div 
          className="flex-1 overflow-hidden p-2 flex items-center justify-center"
          style={{ maxHeight: isSharedView ? '400px' : '320px' }}
        >
          <div dangerouslySetInnerHTML={{ __html: link.embedHtml }} />
        </div>
        
        {/* Action buttons - Always visible unless shared view */}
        {!isSharedView && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center flex-shrink-0">
            <button 
              onClick={() => onChat?.(link)} 
              className="flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-800 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button 
              onClick={handleDelete} 
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Standard card for YouTube, Instagram, etc.
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col group relative min-h-[400px] max-h-[400px]"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Image section */}
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden flex-shrink-0">
        <img
          src={link.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=No+Preview'}
          alt={link.title || 'Link preview'}
          className="w-full h-[160px] object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Error'; }}
        />
      </a>

      {/* Content section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Platform indicator */}
        <div className="flex items-center gap-2 mb-2">
          <PlatformIcon platform={link.platform} />
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            {link.platform}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg leading-tight text-zinc-900 mb-2">
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-sky-600 transition-colors line-clamp-3"
            title={link.title || ''}
          >
            {link.title}
          </a>
        </h3>

        {/* Description - Fixed the title attribute issue */}
        <p 
          className="text-sm text-zinc-700 line-clamp-2 flex-1"
          title={link.description || ''}
        >
          {link.description}
        </p>
      </div>
      
      {/* Action buttons - Always visible unless shared view */}
      {!isSharedView && (
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center flex-shrink-0">
          <button 
            onClick={() => onChat?.(link)} 
            className="flex items-center gap-2 text-sm text-sky-600 font-semibold hover:text-sky-800 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button 
            onClick={handleDelete} 
            className="text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
