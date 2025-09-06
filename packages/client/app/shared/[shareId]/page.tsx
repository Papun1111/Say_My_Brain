"use client";

import { useEffect, useState } from 'react';
import { Link, getSharedLinks } from'@/app/services/api'

import LinkCard from '@/app/components/LinkCard';
import { BrainCircuit, AlertTriangle } from 'lucide-react';
import SkeletonCard from '@/app/components/ui/SkeletonCard'; // We'll create this next

interface SharedPageProps {
  params: { shareId: string };
}

export default function SharedPage({ params }: SharedPageProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedLinks = async () => {
      try {
        setIsLoading(true);
        const data = await getSharedLinks(params.shareId);
        setLinks(data);
      } catch (err) {
        setError('This shared brain could not be found or is no longer available.');
        console.error("Failed to fetch shared links", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedLinks();
  }, [params.shareId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col items-center gap-2 mb-10 text-center">
          <BrainCircuit className="w-10 h-10 text-sky-500" />
          <h1 className="text-3xl font-bold text-slate-800">A Shared Brain</h1>
          <p className="text-slate-500">You are viewing a collection of links shared by another user.</p>
        </header>

        {error ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">Error</h2>
            <p className="text-slate-500 mt-2">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} isSharedView={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
