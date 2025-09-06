"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export default function ViewSharedBrain() {
  const [shareId, setShareId] = useState('');
  const router = useRouter();

  const handleView = () => {
    if (shareId.trim()) {
      router.push(`/shared/${shareId.trim()}`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-2">View a Shared Brain</h3>
      <p className="text-sm text-slate-500 mb-3">
        Paste a share ID or full link below to view someone else's collection.
      </p>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter share ID or link..."
          value={shareId}
          onChange={(e) => setShareId(e.target.value)}
        />
        <Button onClick={handleView}>View</Button>
      </div>
    </div>
  );
}
