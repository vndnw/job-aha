export default function ViewportLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fafafa] overflow-y-auto animate-pulse">
      
      {/* Stats Grid Skeleton */}
      <div className="p-4 sm:p-6 pb-2 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-3xs space-y-2">
              <div className="h-3 w-16 bg-zinc-150 rounded-md" />
              <div className="h-5.5 w-12 bg-zinc-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Viewport Details Header Skeleton */}
      <div className="px-4 sm:px-6 py-5 bg-white border-y border-zinc-200/80 flex justify-between items-center gap-4 shrink-0 shadow-3xs">
        <div className="space-y-2.5">
          <div className="h-4.5 w-64 bg-zinc-250 rounded-md" />
          <div className="flex gap-2">
            <div className="h-3.5 w-16 bg-zinc-150 rounded-md" />
            <div className="h-3.5 w-16 bg-zinc-150 rounded-md" />
            <div className="h-3.5 w-24 bg-zinc-150 rounded-md" />
          </div>
        </div>
        <div className="h-8 w-24 bg-zinc-200 rounded-lg shrink-0" />
      </div>

      {/* Tabs bar placeholder */}
      <div className="flex border-b border-zinc-200/80 bg-white px-4 sm:px-6 shrink-0 gap-6">
        <div className="py-3 h-4 w-28 bg-zinc-200 rounded-md" />
        <div className="py-3 h-4 w-24 bg-zinc-100 rounded-md" />
      </div>

      {/* Content scrolling skeleton */}
      <div className="flex-1 p-4 sm:p-6 space-y-5">
        <div className="h-4 w-40 bg-zinc-200 rounded-md" />
        
        <div className="space-y-3 bg-white border border-zinc-200/80 rounded-xl p-5 shadow-3xs">
          <div className="h-4.5 w-1/3 bg-zinc-200 rounded-md mb-2" />
          <div className="h-3 w-full bg-zinc-100 rounded-md" />
          <div className="h-3 w-full bg-zinc-100 rounded-md" />
          <div className="h-3 w-5/6 bg-zinc-100 rounded-md" />
        </div>

        <div className="space-y-3 bg-white border border-zinc-200/80 rounded-xl p-5 shadow-3xs">
          <div className="h-4.5 w-1/4 bg-zinc-200 rounded-md mb-2" />
          <div className="h-3 w-full bg-zinc-100 rounded-md" />
          <div className="h-3 w-5/6 bg-zinc-100 rounded-md" />
        </div>
      </div>

    </div>
  );
}
