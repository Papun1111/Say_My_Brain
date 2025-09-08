"use client";

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createLink } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkAdded: () => void;
}

export default function AddLinkModal({ isOpen, onClose, onLinkAdded }: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
      setError("Please enter a valid URL.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createLink(url);
      toast.success('Link saved successfully!');
      onLinkAdded();
      handleClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save the link.';
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
  };

  return (
    <>
      {/* Blurred Background Overlay with Darker Black Tint */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)', // Safari support
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker black tint (increased from 0.3 to 0.5)
            }}
            onClick={handleClose} // Tap anywhere to close
          />
        )}
      </AnimatePresence>

      {/* Custom Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add a New Link
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2">
                      Link URL
                    </label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://www.youtube.com/..."
                      value={url}
                      onChange={handleUrlChange}
                      required
                      className="w-full"
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.p 
                          className="text-sm text-red-600 mt-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!url || isSubmitting}>
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Link'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
