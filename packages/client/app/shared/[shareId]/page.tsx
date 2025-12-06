"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 

import { Link as LinkType, getSharedLinks } from '@/app/services/api';

import LinkCard from '@/app/components/LinkCard';
import SkeletonCard from '@/app/components/ui/SkeletonCard';
import Dither from '@/app/components/ui/Dither';
import { BrainCircuit, AlertTriangle, Terminal, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';


export default function SharedPage() {
  const params = useParams(); 
  const shareId = params.shareId as string; 

  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shareId) {
      const fetchSharedLinks = async () => {
        try {
          setIsLoading(true);
          setError('');
          
          const data = await getSharedLinks(shareId);
          setLinks(data);
        } catch (err) {
          setError('ACCESS DENIED: LINK INVALID OR EXPIRED');
          console.error("Failed to fetch shared links", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSharedLinks();
    }
  }, [shareId]);

  // Helper function to render the main content based on the current state
  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="p-4 bg-red-500/10 rounded-sm border border-red-500/20 mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">System Error</h2>
          <p className="text-red-400 font-mono text-sm border-l-2 border-red-500 pl-4">{error}</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="opacity-50">
                <SkeletonCard />
             </div>
          ))}
        </div>
      );
    }
    
    if (links && links.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {links.map((link) => (
            <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <LinkCard link={link} isSharedView={true} />
            </motion.div>
          ))}
        </div>
      );
    }

    // Handle the case where a valid brain is found but contains no links
    return (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-sm bg-white/5">
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-500 mb-2">Void Detected</h2>
            <p className="text-gray-600 font-mono text-xs">Target database contains 0 entries.</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#22c55e] selection:text-black font-sans relative overflow-x-hidden">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
        <Dither
          waveColor={[0.15, 0.15, 0.15]} 
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.4}
          colorNum={2}
          pixelSize={3}
          waveAmplitude={0.4}
          waveSpeed={0.02}
        />
      </div>

      <div className="relative z-10 container mx-auto p-4 md:p-8">
        
        {/* Header Section */}
        <header className="flex flex-col items-center gap-6 mb-16 text-center pt-8 border-b border-white/10 pb-12">
          
          {/* Icon Badge */}
          <div className="relative">
             <div className="absolute inset-0 bg-[#22c55e] blur-xl opacity-20 rounded-full"></div>
             <div className="relative p-4 bg-[#0a0a0a] border border-[#22c55e] rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <BrainCircuit className="w-8 h-8 text-[#22c55e]" />
             </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#22c55e]">
                <Globe className="w-3 h-3" />
                <span>External Connection</span>
                <span className="w-1 h-1 bg-[#22c55e] rounded-full animate-pulse mx-2"></span>
                <span>Active</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              Shared <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">Memory</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500 bg-white/5 py-2 px-4 rounded-sm  border border-white/5">
                <ShieldCheck className="w-3 h-3 text-gray-300" />
                <span>READ_ONLY_ACCESS_GRANTED</span>
            </div>
            
            <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed border-t border-white/10 pt-4 mt-2">
               You are viewing a curated dataset from an external neural network. 
               Interaction capabilities are limited to observation.
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[400px]">
           {renderContent()}
        </main>
        
        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-100 font-mono uppercase tracking-widest">
                SECURE CONNECTION // SAY MY BRAIN
            </p>
        </footer>
      </div>
    </div>
  );
}