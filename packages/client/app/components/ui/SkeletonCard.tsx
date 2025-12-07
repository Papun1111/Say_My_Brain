"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="relative h-full bg-[#0a0a0a] rounded-sm border border-white/10 overflow-hidden flex flex-col">
      
      {/* --- AWESOME ANIMATION: System Scan Beam --- */}
      {/* A glowing green line that scans top to bottom */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-[#22c55e] z-20 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ 
          duration: 2, 
          ease: "linear", 
          repeat: Infinity,
          repeatDelay: 0.5 
        }}
      />
      
      {/* Subtle Shimmer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-20 animate-pulse pointer-events-none" />

      {/* --- CARD STRUCTURE (Matching LinkCard) --- */}

      {/* 1. Image Placeholder */}
      <div className="aspect-video w-full bg-[#111] border-b border-white/5 relative overflow-hidden">
         {/* Icon hint in corner */}
         <div className="absolute top-2 right-2 w-6 h-6 rounded-sm bg-white/5 border border-white/5" />
         
         {/* Diagonal generic placeholder graphic */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-[#22c55e]/20 animate-spin" />
         </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        
        {/* Platform Badge & ID Row */}
        <div className="flex justify-between items-center">
           <div className="h-6 w-20 bg-white/10 rounded-sm" /> {/* Platform */}
           <div className="h-3 w-10 bg-white/5 rounded-sm" />  {/* ID */}
        </div>

        {/* Title Block */}
        <div className="space-y-2 mt-1">
           <div className="h-5 w-3/4 bg-white/10 rounded-sm" />
           <div className="h-5 w-1/2 bg-white/10 rounded-sm" />
        </div>

        {/* Description Lines */}
        <div className="space-y-2 mt-2 opacity-50">
           <div className="h-2 w-full bg-white/10 rounded-sm" />
           <div className="h-2 w-full bg-white/10 rounded-sm" />
           <div className="h-2 w-2/3 bg-white/10 rounded-sm" />
        </div>
      </div>

      {/* 3. Footer Actions */}
      <div className="mt-auto p-3 border-t border-white/10 bg-[#0f0f0f] flex justify-between items-center gap-2">
         {/* Chat Button Placeholder */}
         <div className="flex-1 h-8 bg-white/5 rounded-sm flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-white/10 rounded-full" />
            <div className="w-12 h-2 bg-white/10 rounded-sm" />
         </div>
         
         {/* Delete Button Placeholder */}
         <div className="h-8 w-8 bg-white/5 rounded-sm" />
      </div>
    </div>
  );
}