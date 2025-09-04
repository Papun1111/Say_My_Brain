"use client";

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createLink, getPreview, PreviewData } from '../services/api';
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
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError('');
    setPreview(null);

    // Simple regex to check for a valid URL format before fetching
    if (newUrl.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
      try {
        setIsLoading(true);
        const previewData = await getPreview(newUrl);
        setPreview(previewData);
      } catch (err) {
        setError('Could not fetch preview. Please check the URL.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !preview || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createLink(url);
      toast.success('Link saved successfully!');
      onLinkAdded();
      handleClose();
    } catch (err) {
      toast.error('Failed to save the link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setPreview(null);
    setError('');
    setIsLoading(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add a New Link">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
            Link URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={handleUrlChange}
            required
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="flex items-center justify-center p-4 my-4 border rounded-lg bg-slate-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              <p className="ml-3 text-slate-700">Fetching preview...</p>
            </motion.div>
          )}

          {preview && (
            <motion.div
              className="border rounded-lg p-4 my-4 bg-slate-50 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-semibold text-slate-800">{preview.title}</h4>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{preview.description}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!preview || isLoading || isSubmitting}>
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

