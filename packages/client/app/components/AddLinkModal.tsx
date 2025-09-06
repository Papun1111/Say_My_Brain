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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add a New Link">
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
    </Modal>
  );
}

