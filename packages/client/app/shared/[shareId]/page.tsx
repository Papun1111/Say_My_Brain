"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 

import { Link, getSharedLinks } from '@/app/services/api';

import LinkCard from '@/app/components/LinkCard';
import SkeletonCard from '@/app/components/ui/SkeletonCard';
import { BrainCircuit, AlertTriangle } from 'lucide-react';


export default function SharedPage() {
  const params = useParams(); 
  const shareId = params.shareId as string; 

  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure shareId exists before attempting to fetch data
    if (shareId) {
      const fetchSharedLinks = async () => {
        try {
          // Reset state for each new fetch
          setIsLoading(true);
          setError('');
          
          const data = await getSharedLinks(shareId);
          setLinks(data);
        } catch (err) {
          setError('This shared brain could not be found or is no longer available.');
          console.error("Failed to fetch shared links", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSharedLinks();
    }
  }, [shareId]); // Update the dependency array to use the shareId from the hook

  // Helper function to render the main content based on the current state
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700">Error</h2>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    
    if (links && links.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} isSharedView={true} />
          ))}
        </div>
      );
    }

    // Handle the case where a valid brain is found but contains no links
    return (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700">This brain is empty.</h2>
            <p className="text-slate-500 mt-2">No links have been shared by this user yet.</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col items-center gap-2 mb-10 text-center">
          <BrainCircuit className="w-10 h-10 text-sky-500" />
          <h1 className="text-3xl font-bold text-slate-800">A Shared Brain</h1>
          <p className="text-slate-500">You are viewing a collection of links shared by another user.</p>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}

