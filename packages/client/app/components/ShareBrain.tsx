"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareBrainProps {
  shareId: string;
}

export default function ShareBrain({ shareId }: ShareBrainProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareId);
    setCopied(true);
    toast.success("ID COPIED TO CLIPBOARD");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
          <Share2 className="w-3 h-3 text-[#22c55e]" />
          <span>Access Token</span>
        </h3>
        <span className="text-[9px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-sm border border-white/5">
          READ_ONLY
        </span>
      </div>
      
      <p className="text-[10px] text-gray-500 mb-3 font-mono leading-relaxed">
        Distribute this ID to grant external viewing permissions.
      </p>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-grow group">
          <input
            type="text"
            readOnly
            value={shareId}
            className="w-full bg-[#050505] border border-white/10 rounded-sm px-3 py-2 text-xs text-[#22c55e] font-mono focus:outline-none focus:border-[#22c55e]/50 transition-colors tracking-wider shadow-inner"
          />
          {/* Subtle glow effect on focus */}
          <div className="absolute inset-0 bg-[#22c55e] opacity-0 group-focus-within:opacity-5 blur-sm transition-opacity pointer-events-none rounded-sm"></div>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex-shrink-0 bg-[#22c55e] hover:bg-[#1ea750] text-black p-2 rounded-sm transition-all duration-200 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] group"
          title="Copy to Clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 scale-110 transition-transform" />
          ) : (
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}