"use client";

import { useState } from 'react';
// We keep your original imports
import { createLink } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2, Link as LinkIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensuring consistent import with your other files

// Assuming these accept className props for overrides. 
// If not, standard HTML inputs/buttons are used inside the styling logic below.
import { Input } from './ui/Input'; 
import { Button } from './ui/Button';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkAdded: () => void;
}

export default function AddLinkModal({ isOpen, onClose, onLinkAdded }: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [linkWasAdded, setLinkWasAdded] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
      setError("INVALID URL DETECTED");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createLink(url);
      toast.success('DATA UPLOADED SUCCESSFULLY');
      setLinkWasAdded(true);
      onLinkAdded();
      handleClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'UPLOAD FAILED';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    setIsSubmitting(false);
    onClose();
    
    // Original Widget Refresh Logic preserved
    setTimeout(() => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
      
      const twitterEmbeds = document.querySelectorAll('.twitter-embed-container');
      twitterEmbeds.forEach((embed) => {
        const originalHTML = embed.innerHTML;
        embed.innerHTML = '';
        setTimeout(() => {
          embed.innerHTML = originalHTML;
          // @ts-ignore
          if (window.twttr && window.twttr.widgets) {
            // @ts-ignore
            window.twttr.widgets.load(embed);
          }
        }, 100);
      });
    }, 300);
    setLinkWasAdded(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Darker and blurred for focus */}
          <motion.div
            className="fixed inset-0 z-40 cursor-pointer bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-lg pointer-events-auto"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* The Card Design */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                
                {/* Header Section */}
                <div className="p-6 border-b border-white/10 bg-[#0f0f0f] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#22c55e]/10 rounded-sm text-[#22c55e] border border-[#22c55e]/20">
                      <LinkIcon size={18} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">
                      Initialize <span className="text-[#22c55e]">Upload</span>
                    </h2>
                  </div>
                  
                  <button
                    onClick={handleClose}
                    className="group p-2 hover:bg-white/5 rounded-sm transition-colors text-gray-500 hover:text-white"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                {/* Body Section */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="space-y-3">
                      <label htmlFor="url" className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                         <span>Target Source</span>
                         <span className="text-[#22c55e]">Required</span>
                      </label>
                      
                      <div className="relative group">
                        {/* Glowing border effect on focus via group-focus-within */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22c55e] to-emerald-600 rounded-sm opacity-0 group-focus-within:opacity-50 transition duration-500 blur"></div>
                        
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://"
                          value={url}
                          onChange={handleUrlChange}
                          required
                          className="relative w-full bg-[#050505] border-white/10 text-white placeholder:text-gray-700 font-mono text-sm rounded-sm py-3 px-4 focus:ring-0 focus:border-[#22c55e] transition-colors"
                        />
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div 
                            className="flex items-center gap-2 text-xs text-red-500 font-mono mt-2 bg-red-500/10 p-2 rounded-sm border border-red-500/20"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                      <Button 
                        type="button" 
                        onClick={handleClose}
                        className="bg-transparent text-gray-500 hover:text-white hover:bg-white/5 uppercase text-xs font-bold tracking-wider border-none px-4 py-2"
                      >
                        Abort
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={!url || isSubmitting}
                        className="relative overflow-hidden bg-[#22c55e] hover:bg-[#1ea750] text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:shadow-none transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing</span>
                          </div>
                        ) : (
                          'Execute Save'
                        )}
                      </Button>
                    </div>

                  </form>
                </div>

                {/* Cosmetic: Decorative technical lines */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}