"use client";

import { Link as LinkType, deleteLink } from '../services/api';
import { MessageSquare, Trash2, Youtube, Twitter, Instagram, Link2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface LinkCardProps {
  link: LinkType;
  onChat?: (link: LinkType) => void;
  refreshLinks?: () => void;
  isSharedView?: boolean;
}

// --- SUB-COMPONENTS ---

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'YOUTUBE': return <Youtube className="w-4 h-4 text-red-600" />;
    case 'X': return <Twitter className="w-4 h-4 text-sky-500" />;
    case 'INSTAGRAM': return <Instagram className="w-4 h-4 text-pink-500" />;
    default: return <Link2 className="w-4 h-4 text-[#22c55e]" />;
  }
};

const PlatformBadge = ({ platform }: { platform: string }) => (
  <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-sm">
    <PlatformIcon platform={platform} />
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {platform || 'WEB'}
    </span>
  </div>
);

// --- MAIN COMPONENT ---

export default function LinkCard({ link, onChat, refreshLinks, isSharedView = false }: LinkCardProps) {
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!refreshLinks) return;
    if (window.confirm("CONFIRM DELETION: THIS ACTION CANNOT BE UNDONE.")) {
      try {
        await deleteLink(link.id);
        toast.success("ENTRY DELETED");
        refreshLinks();
      } catch (error) {
        toast.error("DELETION FAILED");
      }
    }
  };
  
  // Twitter Widget Reloader
  useEffect(() => {
    if (link.platform === 'X' && link.embedHtml) {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, [link.platform, link.embedHtml]);

  // --- RENDER: TWITTER / X CARD ---
  if (link.platform === 'X' && link.embedHtml) {
    return (
      <motion.div 
        className="bg-[#0a0a0a] rounded-sm border border-white/10 overflow-hidden flex flex-col h-full hover:border-[#22c55e]/50"
        whileHover={{ 
          y: -5, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(34, 197, 94, 0.1)" 
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#0f0f0f]">
           <PlatformBadge platform="X" />
           <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></div>
        </div>
        
        <div className="flex-1 bg-white p-2">
           <div dangerouslySetInnerHTML={{ __html: link.embedHtml }} />
        </div>
        
        {/* Footer Actions */}
        {!isSharedView && (
          <div className="p-3 border-t border-white/10 bg-[#0f0f0f] flex justify-between items-center gap-2">
             <button 
              onClick={() => onChat?.(link)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-[#22c55e] hover:text-black text-xs font-bold uppercase tracking-wider text-gray-400 transition-all duration-200 rounded-sm group"
             >
               <MessageSquare className="w-3 h-3 group-hover:scale-110 transition-transform" />
               <span>Analyze</span>
             </button>
             
             <button 
               onClick={handleDelete}
               className="p-2 bg-white/5 hover:bg-red-900/50 hover:text-red-500 text-gray-600 transition-colors rounded-sm"
               title="Delete Entry"
             >
               <Trash2 className="w-3 h-3" />
             </button>
          </div>
        )}
      </motion.div>
    );
  }

  // --- RENDER: STANDARD CARD (YouTube, Web, etc.) ---
  return (
    <motion.div 
      className="bg-[#0a0a0a] rounded-sm border border-white/10 overflow-hidden flex flex-col h-full hover:border-[#22c55e]/50 group"
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(34, 197, 94, 0.1)" 
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden border-b border-white/5 bg-black">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
          <motion.img
            src={link.thumbnailUrl || 'https://placehold.co/600x400/111/333?text=NO+SIGNAL'}
            alt={link.title || 'Link preview'}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/000/333?text=ERR_IMG'; }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 pointer-events-none"></div>
          
          {/* External Link Icon Overlay */}
          <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-sm text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
             <ExternalLink className="w-3 h-3" />
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 relative">
        {/* Platform Tag */}
        <div className="mb-3 flex justify-between items-start">
           <PlatformBadge platform={link.platform} />
           {/* Decorative ID number */}
           <span className="text-[9px] font-mono text-gray-700">ID-{link.id}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm md:text-base leading-tight text-gray-200 mb-2 line-clamp-2 group-hover:text-[#22c55e] transition-colors uppercase tracking-tight">
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.title || 'UNTITLED_ENTRY'}
          </a>
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-3 font-mono leading-relaxed mb-4">
          {link.description || 'No metadata available for this entry.'}
        </p>
      </div>

      {/* Action Footer */}
      {!isSharedView && (
        <div className="mt-auto p-3 border-t border-white/10 bg-[#0f0f0f] flex justify-between items-center gap-2">
           <button 
            onClick={() => onChat?.(link)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-[#22c55e] hover:text-black text-xs font-bold uppercase tracking-wider text-gray-400 transition-all duration-200 rounded-sm group"
           >
             <MessageSquare className="w-3 h-3 group-hover:scale-110 transition-transform" />
             <span>Neural Chat</span>
           </button>
           
           <button 
             onClick={handleDelete}
             className="p-2 bg-white/5 hover:bg-red-900/50 hover:text-red-500 text-gray-600 transition-colors rounded-sm"
             title="Delete Entry"
           >
             <Trash2 className="w-3 h-3" />
           </button>
        </div>
      )}
    </motion.div>
  );
}