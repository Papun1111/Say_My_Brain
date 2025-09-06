import SkeletonCard from "@/app/components/ui/SkeletonCard";
import { BrainCircuit } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col items-center gap-2 mb-10 text-center">
        <BrainCircuit className="w-10 h-10 text-sky-500" />
        <h1 className="text-3xl font-bold text-slate-800">Loading Shared Brain...</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
