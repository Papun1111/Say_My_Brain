export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-slate-200"></div>
      <div className="p-4">
        {/* Platform Placeholder */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-slate-200"></div>
          <div className="h-2 w-1/4 rounded bg-slate-200"></div>
        </div>
        {/* Title Placeholder */}
        <div className="h-4 rounded bg-slate-200 mb-2"></div>
        <div className="h-4 w-5/6 rounded bg-slate-200"></div>
        {/* Description Placeholder */}
        <div className="mt-3 space-y-2">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="h-2 w-11/12 rounded bg-slate-200"></div>
        </div>
      </div>
       {/* Footer Placeholder */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <div className="h-4 w-1/4 rounded bg-slate-200"></div>
        <div className="h-4 w-1/6 rounded bg-slate-200"></div>
      </div>
    </div>
  );
}

