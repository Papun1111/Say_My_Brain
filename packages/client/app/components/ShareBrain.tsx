"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, Check } from 'lucide-react';

interface ShareBrainProps {
  shareId: string;
}

export default function ShareBrain({ shareId }: ShareBrainProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/shared/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-2">Share Your Brain</h3>
      <p className="text-sm text-slate-500 mb-3">
        Anyone with this link will be able to view your saved links.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="flex-grow bg-slate-100 border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700"
        />
        <button
          onClick={handleCopy}
          className="flex-shrink-0 bg-sky-500 text-white p-2 rounded-md hover:bg-sky-600 transition-colors"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
